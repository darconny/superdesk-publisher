/**
 * @ngdoc directive
 * @module superdesk.apps.web_publisher
 * @name sdGroupArticle
 * @requires publisher
 * @description Directive list articles by group in monitoring
 */
GroupArticleDirective.$inject = ['publisher'];
export function GroupArticleDirective(publisher) {
    class GroupArticle {
        constructor() {
            this.scope = {
                rootType: '@',
                webPublisherOutput: '=webPublisherOutput',
                initialFilters: '=filters'
            };

            this.template = require('./view.html');
        }

        link(scope) {
            scope.loadingArticles = false;
            scope.listenerAttached = false;
            scope.articlesList = [];
            scope.articlesLimit = 20;
            scope.filters = scope.initialFilters ? scope.initialFilters : {};
            scope.loadedFilters = !!scope.filters;
            publisher.setToken().then(() => {
                scope.loadArticles(true);

                scope.$watch('rootType', () => {
                    scope.loadArticles(true);
                });
            });

            scope.$watch(() => scope.webPublisherOutput.selectedArticle, (newVal, oldVal) => {
                if (newVal && !scope.listenerAttached) {
                    window.addEventListener('keydown', scope.keyPressedHandler);
                    scope.listenerAttached = true;
                } else if (!newVal && scope.listenerAttached) {
                    window.removeEventListener('keydown', scope.keyPressedHandler);
                    scope.listenerAttached = false;
                }
            }, true);

            scope.$on('$destroy', () => {
                window.removeEventListener('keydown', scope.keyPressedHandler);
            });



            scope.keyPressedHandler = (e) => {
                let articleIndex = scope.articlesList.findIndex(el => el.id === scope.webPublisherOutput.selectedArticle.id );

                if (articleIndex < 0) return;

                e = e || window.event;
                if (e.keyCode == '38') {
                    articleIndex = articleIndex - 1;
                }
                else if (e.keyCode == '40') {
                    articleIndex = articleIndex + 1;
                }
                if (scope.articlesList[articleIndex]) {
                    scope.webPublisherOutput.openPreview(scope.articlesList[articleIndex]);
                }

            };

            scope.buildRouteParams = () => {
                let route = [];

                if (scope.filters.routes) {
                    angular.forEach(scope.filters.routes, (routeObj, key) => {
                        route.push(routeObj.id);
                    });
                }
                return route;
            };



            scope.buildUniversalParams = () => {
                let universalParams = {};

                if (scope.filters.author && scope.filters.author.length) {
                    universalParams['author[]'] = scope.filters.author;
                }

                if (scope.filters.source && scope.filters.source.length) {
                    universalParams['source[]'] = scope.filters.source;
                }

                if (scope.filters.term && scope.filters.term.length) {
                    universalParams.term = scope.filters.term;
                }

                return universalParams;
            };

            scope.buildQueryParams = (reset) => {
                let page = reset || !scope.totalArticles ? 1 : scope.totalArticles.page + 1;
                let queryParams = {
                    page: page,
                    limit: scope.articlesLimit,
                    'status[]': [],
                    'sorting[updatedAt]': 'desc'
                };

                let route = scope.buildRouteParams();
                let universal = scope.buildUniversalParams();

                queryParams = Object.assign(queryParams, universal);

                // building query params for both cases
                if (scope.rootType && scope.rootType === 'incoming') {
                    queryParams['status[]'] = ['new'];
                } else {
                    queryParams['status[]'] = ['published', 'unpublished'];
                    queryParams['route[]'] = route.length ? route : undefined;
                    queryParams.publishedBefore = scope.filters.publishedBefore;
                    queryParams.publishedAfter = scope.filters.publishedAfter;
                }
                return queryParams;
            };

            scope.$on('newPackage', (e, item, state) => {
               if (!this._isNewPackageInteresting(item, scope)) {
                   return false;
               }
               item.animate = true;
               if (state === 'update') {
                    //update
                    let elIndex = scope.articlesList.findIndex(el => el.guid === item.guid);
                    if (elIndex !== -1) {
                        scope.articlesList[elIndex] = item;
                    }
               } else {
                    //new article
                    scope.articlesList = [item].concat(scope.articlesList);
                    if (scope.articlesList.length % scope.articlesLimit === 0) {
                        scope.articlesList.splice(-1,1)
                    }
                    scope.totalArticles.total += 1;
                    scope.totalArticles.pages = Math.ceil(scope.totalArticles.total/scope.articlesLimit);
                    scope.webPublisherOutput.articlesCount[scope.rootType] = scope.totalArticles.total;
               }

               scope.$apply();

            });

            scope.$on('removeFromArticlesList', (e, itemId) => {
                if (!itemId || scope.rootType === 'published') return;

                let index = scope.articlesList.findIndex((el) => el.id === itemId);

                if (index > -1) {
                    scope.articlesList.splice(index, 1);
                    scope.totalArticles.total -= 1;
                    scope.totalArticles.pages = Math.ceil(scope.totalArticles.total/scope.articlesLimit);
                    scope.webPublisherOutput.articlesCount[scope.rootType] = scope.totalArticles.total;
                }
            });

            scope.$on('refreshArticlesList', (e, filters) => {
                if (filters) {
                    scope.filters = filters;
                    scope.loadedFilters = true;
                }
                if (filters || scope.rootType) {
                    scope.loadArticles(true);
                }
            });

            scope.loadArticles = (reset) => {

                if (scope.loadingArticles) {
                    return;
                }

                if (reset) {
                    scope.articlesList = [];
                }

                let queryParams = scope.buildQueryParams(reset);

                if (!reset && scope.totalArticles && queryParams.page > scope.totalArticles.pages) {
                    return;
                }

                scope.loadingArticles = true;
                scope.webPublisherOutput.loadingArticles = true;

                publisher.queryMonitoringArticles(queryParams).then((articles) => {
                    scope.totalArticles = articles;
                    scope.articlesList = scope.articlesList.concat(articles._embedded._items);
                    scope.loadingArticles = false;
                    scope.webPublisherOutput.loadingArticles = false;
                    scope.webPublisherOutput.articlesCount[scope.rootType] = scope.totalArticles.total;
                })
                .catch((err) => {
                    scope.loadingArticles = false;
                    scope.webPublisherOutput.loadingArticles = false;
                });
            };
        }

        _isNewPackageInteresting(item, scope) {


            if ( scope.rootType &&
                (scope.rootType === 'incoming' && item.status === 'published' ||
                scope.rootType === 'published' && item.status === 'new') ) {
                return false;
            }

            // return true if everything passes checks
            return true;
        };
    }

    return new GroupArticle();
}
