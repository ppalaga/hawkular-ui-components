/// Copyright 2014-2015 Red Hat, Inc. and/or its affiliates
/// and other contributors as indicated by the @author tags.
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///   http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.

/// <reference path="metricsPlugin.ts"/>

module HawkularMetrics {


    export class AddUrlController {
        public static $inject = ['$location', '$scope', '$log', 'HawkularInventory'];

        private httpUriPart = 'http://';

        constructor(private $location:ng.ILocationService,
                    private $scope:any,
                    private $log:ng.ILogService,
                    private HawkularInventory:any,
                    public resourceUrl:string) {
            $scope.vm = this;
            this.resourceUrl = this.httpUriPart;

        }

        addUrl(resourceId:string):void {
            var cleanedResourceId = resourceId.substr(this.httpUriPart.length);
            var resource = {
                type: 'URL',
                id: '',
                parameters: {
                    url: resourceId
                }
            };

            this.$log.info("Adding new Resource Url to Hawkular-inventory: " + cleanedResourceId);

            /// Add the Resource
            this.HawkularInventory.Resource.save({tenantId: tenantId}, resource).$promise
                .then((newResource) => {
                    // we now have a resourceId from this call
                    this.$log.info("New Resource ID: " + newResource.id);
                    var metrics = [{
                        name: newResource.id + '.status.duration',
                        unit: 'MILLI_SECOND',
                        description: 'Response Time in ms.'
                    }, {
                        name: newResource.id + '.status.code',
                        unit: 'NONE',
                        description: 'Status Code'
                    }];


                    /// @todo: this will become the 'Metrics Selection' screen once we get that
                    /// For right now we will just Register a couple of metrics automatically
                    this.HawkularInventory.Metric.save({
                        tenantId: tenantId,
                        resourceId: newResource.id
                    }, metrics).$promise.then((newMetrics) => {
                            /// Hop on over to the metricsView page for charting
                            this.$location.url("/metrics/metricsResponse");
                        });

                });


        }
    }

    _module.controller('HawkularMetrics.AddUrlController', AddUrlController);

}
