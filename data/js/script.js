var app = angular.module('home',[]);

app.controller('home', function ($scope) {
	window.fbAsyncInit = function() {
        FB.init({
            appId      : '1261990543879838',
            xfbml      : true,
            status     : true,
            version    : 'v2.8'
        });
    };

	var socket = io();
	var user_name='qwerty'
	$scope.var=null;


	socket.emit('user name',user_name); // sending user name to the server

    socket.on('user entrance',function(data,my_id){
    	//checking the user id
    	if($scope.my_id==null){
    	    $scope.my_id=my_id;
    	}
    	$scope.user_show=data;
		$scope.$apply(); 
	}); 	

	
	//on exit updating the List od users
	socket.on('exit',function(data){
		$scope.user_show=data;
	    $scope.$apply(); 
	});


	//refreshing browsers
	socket.on('refresh browsers',function(myid){
		if($scope.my_id!=myid){
			var commentsContainer = document.getElementById('commentWrapper');
			commentsContainer.innerHTML = '<div class="fb-comments" id="comments" data-href="http://softr.net/fiverr/mula78/data/" data-width="700" data-numposts="25"  data-order-by="reverse_time"></div>';
	        FB.XFBML.parse(commentsContainer);
	        console.log('refresh browsers', myid)
		}
	});


	$(window).load(function() {
      console.log('load event')
        var comment_callback = function(response) {
            console.log("comment_callback");
            console.log(response);
            console.log($scope.user_show)
			socket.emit('refresh browsers',$scope.user_show, $scope.my_id); // sending info to the server
        }
        FB.Event.subscribe('comment.create', comment_callback);
        FB.Event.subscribe('comment.remove', comment_callback);
        FB.XFBML.parse(document.getElementById("comments"));
    });


});