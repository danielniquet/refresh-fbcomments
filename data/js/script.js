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

	//function to send messages.
	$scope.send_msg = function($event){
	    var keyCode = $event.which || $event.keyCode;
	    if($scope.selected_id==$scope.my_id){
	    	alert("You can't send mmsg to your self.");
	    }else{
	    	if (keyCode === 13) { 
		    	var data_server={
		    		id:$scope.selected_id,
		    		msg:$scope.msg_text,
		    		name:user_name
		    	};
		    	$scope.msg_text='';
		        socket.emit('send msg',data_server);
	        }
	    }	    
	};

	//to highlight selected row
	$scope.clicked_highlight = function(id,name){
		$scope.clicked=id;
		$scope.selected_id=id;
		$scope.selected_name=name;
	    $scope.$apply(); 
	};
	
	//on exit updating the List od users
	socket.on('exit',function(data){
		$scope.user_show=data;
	    $scope.$apply(); 
	});

	//displaying the messages.
	socket.on('get msg',function(data){
		$scope.msgs=data;
		$scope.is_msg_show=true;
		$scope.$apply(); 

        console.log('get msg', data)
	});

	//refreshing browsers
	socket.on('refresh browsers',function(myid){

        console.log('refresh browsers', myid)
	});


	$(window).load(function() {
      console.log('load event')
        var comment_callback = function(response) {
            console.log("comment_callback");
            console.log(response);
            console.log($scope.user_show)
			socket.emit('refresh browsers',$scope.user_show, $scope.my_id); // sending user name to the server
        }
        FB.Event.subscribe('comment.create', comment_callback);
        FB.Event.subscribe('comment.remove', comment_callback);
        FB.XFBML.parse(document.getElementById("comments"));

    });


});