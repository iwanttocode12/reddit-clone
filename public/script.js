$(document).ready( () => { 

	var firebaseConfig = {
		apiKey: "AIzaSyAkfkvoWXPF00fJl3wJSM-8k6Z5_0to2QE",
		authDomain: "my-reddit-clone-9b68e.firebaseapp.com",
		databaseURL: "https://my-reddit-clone-9b68e.firebaseio.com",
		projectId: "my-reddit-clone-9b68e",
		storageBucket: "my-reddit-clone-9b68e.appspot.com",
		messagingSenderId: "104929740840",
		appId: "1:104929740840:web:053bd134e87fbdd8ae8d1d",
		measurementId: "G-M3JH3Q66WM"
	};

	firebase.initializeApp(firebaseConfig);
	var database = firebase.database();

	var DAY_IN_MS = 86400000;

	database.ref('posts')
		.orderByChild('createdAt')
		.startAt(Date.now() - DAY_IN_MS)
		.on('child_added', snapshot => {
			if ($('#loadingMsg').is(':visible')){
				$('#loadingMsg').hide();
			}
			var result = snapshot.val();
			result.id = snapshot.key;
			buildPost(result);
		});


	// update votes
	database.ref('posts')
		.orderByChild('createdAt')
		.startAt(Date.now() - DAY_IN_MS)
		.on('child_changed', snapshot => {
		var result = snapshot.val()
		result.id = snapshot.key;
		$('.votes#' + result.id).text(result.votes) 
	})

	function buildPost(item){
		var template = $('#content-template').clone();
		var newPost = template.prop('content');

		$(newPost).find('.content-title').text(item.title);
		$(newPost).find('.content-link').attr('href', item.link).attr('target', '_blank');
		$(newPost).find('.votes').text(item.votes).attr('id', item.id);
		$(newPost).find('.content-meta').text(item.user + ' posted ' + moment(item.createdAt).fromNow());

		$(newPost).find('.arrow').attr('id', item.id);
		$(newPost).find('.vote-up').on('click', upvote);
		$(newPost).find('.vote-down').on('click', downvote);

		$('#list').prepend(newPost);
	}

	//add a new post
	$('#sharePost').on('click', () => {
		var link = $('#inputURL').val();
		var title = $('#inputTitle').val();
		var user = $('#inputUser').val();
		var createdAt = Date.now();
		var votes = 0;

		var newPost = {
			title: title,
			link: link,
			user: user,
			votes: votes,
			createdAt: createdAt
		};

		// adding to db
		var postRef = database.ref('posts');
		var newPostRef = postRef.push(newPost, (err) => {
			if (err) {
				console.error('Error saving to firebase', err);
			} else {
				console.log('Success saving to firebase');
				$('#inputURL').val('');
				$('#inputTitle').val('');
				$('#inputUser').val('');
				$('#addPost').hide();
			}
		});

	});

	//cancel a post
	$('#cancelPost').on('click', ()=>{
		$('#inputURL').val('');
		$('#inputTitle').val('');
		$('#inputUser').val('');
	});

	$('#cancelPostIcon').on('click', ()=>{
		$('#inputURL').val('');
		$('#inputTitle').val('');
		$('#inputUser').val('');
	});

	//upvote/downvote
	function upvote() {
		var itemID = $(this).attr('id');
		database.ref('/posts/' + itemID + '/votes')
			.transaction((currentVotes) => {
				return currentVotes+1;
			});
	}

	function downvote() {
		var itemID = $(this).attr('id');
		database.ref('/posts/' + itemID + '/votes')
			.transaction((currentVotes) => {
				return currentVotes-1;
			});
	}

});



/*
1. css (Look like reddit)

2. user authentication (linking profiles to upvotes, downvotes, comments, replies. ) (implement firebase authentication)

3. videos and photos on page. open in pop up.

4. sort by trending, what's new etc

5. what about deleted users, posts, comments, replies

6. loading 

7. search properties

8. share posts. 

9. categories (subreddits), tags, join, (listing tags)

*/
