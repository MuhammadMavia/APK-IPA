var WSURL = "http://www.ezshulter.com/app/cab/";

angular.module('cabApp', ['ionic','ngCordova'])
.run(function($ionicPlatform)
{
    $ionicPlatform.ready(function()
    {
        if(window.cordova && window.cordova.plugins.Keyboard)
        {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if(window.StatusBar)
        {
            StatusBar.styleDefault();
        }
      admob.setOptions({
      publisherId:          "ca-app-pub-6929535743924376/1568986849",  //ca-app-pub-5565114356154579/9639417042 Required
                                        // Optional
    });

    // Start showing banners (atomatic when autoShowBanner is set to true)
    admob.createBannerView();

    // Request interstitial (will present automatically when autoShowInterstitial is set to true)
    // admob.requestInterstitialAd();


    // Request interstitial (will present automatically when autoShowInterstitial is set to true)
    admob.requestInterstitialAd();



		console.log('test99');
		console.log('end');
      //   if(window.plugins && window.plugins.AdMob)
      //   {
      //       //var admob_key = device.platform == "Android" ? "ca-app-pub-6929535743924376/9974220048" : "ca-app-pub-6929535743924376/3927686440";
      //
      //       var admobid = {};
			// console.log(device.platform);
      //       if(device.platform=="Android")
      //       {
      //           admobid =
      //           {
      //               banner: 'ca-app-pub-6929535743924376/1568986849',
      //               interstitial: 'ca-app-pub-6929535743924376/5426158842'
      //           };
      //       }
      //       else
      //       {
      //           admobid =
      //           {
      //               banner: 'ca-app-pub-6929535743924376/3927686440',
      //               interstitial: 'ca-app-pub-6929535743924376/9856358448'
      //           };
      //       }
      //
      //
      //       var admob = window.plugins.AdMob;
      //
      //       console.log(admob);
      //
      //       admob.createBannerView(
      //           {
      //               'adId':admobid.banner,
      //               'adSize': admob.AD_SIZE.BANNER,
      //               'bannerAtBottom': true
      //           },
      //           function()
      //           {
			// 		   console.log('fail');
      //               admob.requestAd(
      //                   { 'isTesting': false },
      //                   function() {
      //                       admob.showAd(true);
      //                   },
      //                   function() { console.log('failed to request ad'); }
      //               );
      //           },
      //           function() { console.log('failed to create banner view'); }
      //       );
      //
      //
      //
      //
      //       var options =
      //       {
      //
      //           interstitialAdId: 'ca-app-pub-6929535743924376/5426158842',
      //           autoShow: true
      //       };
      //
      //       admob.createInterstitialView(options, function()
      //       {
      //           admob.requestInterstitialAd({
      //               'isTesting': false
      //           },
      //           function() {
      //               admob.showAd(true);
      //           },
      //           function(error) {
      //               console.log('failed to request ad ' + error);
      //           }
      //           );
      //       },
      //       function()
      //       {
      //           console.log('failed to create Interstitial view');
      //       });
      //   }

    });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider)
{
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.backButton.text('').icon('ion-ios-arrow-left').previousTitleText(false);


    $stateProvider
    .state('home',
    {
        url: '/home',
        views:
        {
            '':
            {
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl',
            }
        }
    })

    .state('map',
    {
        url: '/map',
        views:
        {
            '':
            {
                templateUrl: 'templates/map.html',
                controller: 'MapCtrl'
            }
        }
    })

    $urlRouterProvider.otherwise('/home');

})

.run(function($ionicPlatform)
{
    $ionicPlatform.ready(function()
    {
        if(window.StatusBar)
        {
            StatusBar.styleDefault();
        }
    });
})

.controller('HomeCtrl',function($scope,$http,$ionicLoading,$ionicModal,$ionicPopup)
{
    $scope.is_contact_display = true;
    $scope.isLoaded = false;

    $ionicModal.fromTemplateUrl('my-modal.html',
    {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal)
    {
        $scope.modal = modal;
    });

    $scope.openModal = function()
    {
        $scope.modal.show();
    };

    $scope.closeModal = function()
    {
        $scope.modal.hide();
    };

    $scope.is_hide_city = false;
    $scope.select_height = '170px';

    $scope.loadCity = function()
    {
        $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
        });

        $http({
          method: 'GET',
          url:'http://www.ezshulter.com/app/cab/GetCity?appid=1',
        }
           )
        .success(function(data, status, headers, config)
        {
            if(data.data.length==1)
            {
                $scope.is_hide_city = true;
                $scope.select_height = '120px';
            }

            $scope.cities = data.data;
            $ionicLoading.hide();
            $scope.selCity = data.data[0]['city_id'];
            $scope.fetchCab(data.data[0]['city_id']);

        })
        .error(function(data,status,headers,config)
        {
          console.log(data);
          console.log(status);
          console.log(headers);
          console.log(config);
            $ionicLoading.hide();
            $ionicPopup.alert(
            {
                title: 'Server error',
                template: 'Might be error with server.'
            });
        })
    }

    $scope.loadCity();

    $scope.getCab = function(cab_id)
    {
        $scope.selectCab = cab_id;

        $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
        });

        $http.get( WSURL + 'GetFairDataByID?id='+cab_id)
        .success(function(data, status, headers, config)
        {
            if(data.data.length==0)
            {
                $ionicPopup.alert(
                {
                    title: 'Data not found',
                    template: 'No fare data found for this cab.'
                });
            }

            $scope.fairs = data;

            if($scope.fairs.ContactNumber=='')
            {
                $scope.bottomPix = '50px';
                $scope.is_contact_display = false;
            }
            else
            {
                $scope.bottomPix = '75px';
                $scope.is_contact_display = true;
            }
			$scope.isLoaded = true;
            $ionicLoading.hide();
        })
        .error(function(data,status,headers,config)
        {
            console.log(data);
            $ionicLoading.hide();
            $ionicPopup.alert(
            {
                title: 'Internet connection error.!',
                template: 'Might be error with internet connection.'
            });
        })
    }

    //$scope.getCab(1);

    $scope.fetchCab = function(cityId)
    {
        $scope.cabs = [];
        $scope.fairs = [];

        $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
        });

        $http.get( WSURL + 'GetOnlyCabByID?appid=1&id='+cityId)
        .success(function(data, status, headers, config)
        {
            if(data.data.length==0)
            {
                $ionicPopup.alert(
                {
                    title: 'Data not found',
                    template: 'No cabs found for this city.'
                });
            }

            $scope.cabs = data.data;
            $ionicLoading.hide();

            if(data.data.length>0)
            {
                $scope.getCab(data.data[0]['cab_id']);
            }
        })
        .error(function(data,status,headers,config)
        {
            $ionicLoading.hide();
            $ionicPopup.alert(
            {
                title: 'Server error',
                template: 'Might be error with server.'
            });
        })
    }

    //$scope.fetchCab(1);
})

.controller('MapCtrl',function($scope,$http, $ionicLoading, $compile,$cordovaGeolocation,$rootScope,$ionicPopup)
{
    $ionicPopup.alert(
            {
                title: 'Information',
                template: 'You Should start GeoLocation for better view.'
            });
    $scope.goBack = function()
    {
        window.history.go(-1);
    }

    var options = {timeout: 10000, enableHighAccuracy: true};
    var directionDisplay;
    var directionsService = new google.maps.DirectionsService();
    var map;

    var lat,longi;
    $cordovaGeolocation.getCurrentPosition(options).then(function(position)
    {
        lat = position.coords.latitude;
        longi = position.coords.longitude;

        directionsDisplay = new google.maps.DirectionsRenderer();
        var melbourne = new google.maps.LatLng(lat, longi);
        var myOptions =
        {
            zoom:12,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: melbourne
        }

        map = new google.maps.Map(document.getElementById("map"), myOptions);
        directionsDisplay.setMap(map);


    }, function(error)
    {
        console.log("Could not get location"+error);
    });

    $scope.distance = "0KM";

    $scope.calcRoute = function(start,end)
    {
        var start = start;
        var end = end;

        console.log(start+end);
        var distanceInput = document.getElementById("distance");

        var request = {
            origin:start,
            destination:end,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };

        directionsService.route(request, function(response, status)
        {
            if (status == google.maps.DirectionsStatus.OK)
            {
                directionsDisplay.setDirections(response);
                $scope.distance = response.routes[0].legs[0].distance.value / 1000+" KM";
            }
            else
            {
                $ionicPopup.alert(
                {
                    title: 'Data not found',
                    template: 'Please enter valid area name or city name.'
                });
            }
        });
    }

    $rootScope.$on('$stateChangeSuccess',
    function()
    {
        //$scope.initialize();
    });
})
