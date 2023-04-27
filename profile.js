
init();
setInterval(() => {
  if(!isLogin()){
    window.location = "index.html"
  }
}, 60);


function init(){
 

}
function isLogin(){
  return localStorage.getItem("token")?true:false;
}
function displayUserInfo(){
  let user = getUser();
  if(user){

    console.log(user)
    document.querySelector(".profile-img").src =isEmptyObject(user.profile_image) ?dummyImageUrl:user.profile_image;
    document.querySelector(".profile-username").innerHTML = user.username;
    document.querySelector(".profile-comments-count").innerHTML = user.comments_count;
    document.querySelector(".profile-posts-count").innerHTML = user.posts_count;
    document.querySelector(".username").innerHTML = user.username;
  }
}

function getUser(){
  return JSON.parse(localStorage.getItem("user")) ;
}

/**
 * 
 * display the user posts
 * 1- get the posts user depending on the other and the current user
 * 2- the posts are all saved in and array of objects
 * 
 * 3- create an infinit scroll for all these posts
 * 4- display the delete and edit buttons
 * 5 - add the add button
 */

//get postss
function getPosts(reload=true){
  
  // GET request for remote image in node.js
  let user = getUser();
  axios({
    method: 'get',
    url: `${baseUrl}/users/${user.id}/posts`,
  })
    .then(function (response) {
      let postsData = response.data.data;
      showPosts(postsData, reload);
    });
}
//show posts
function showPosts(postsData, reload){
  let posts = document.querySelector(".posts");
  // get the current user
  let localUser = JSON.parse(localStorage.getItem("user"));
  if(reload){
    posts.innerHTML = "";

  }
  for(let post of postsData){
    console.log(post)
    if(localUser && localUser.id == post.author.id){
      let author = post.author;
      let postTitle = ""
      
      if(post.title !=null)
        postTitle = post.title;

      let tags = post.tags;
      // console.log(post)
      let tagsContent = "";
      if(tags.length !=0){
        // let postTags = document.querySelector(".post-tags");
        // postTags.innerHTML = "";
        for(tag of tags){
          tagsContent += `
        <div class="tag bg-secondary text-light rounded-pill px-2" style=" font-weight: bold;padding-bottom: 0.25rem;" >${tag.name}</div>
        `
        }  
      }

      let contentEditDelete = "";
    
      // buttons contents
        contentEditDelete = `
              <button class="btn btn-secondary" onclick="editPostBtnClicked('${encodeURI(JSON.stringify(post))}')">Edit</button>
              <button class="btn btn-danger" onclick="deletePostBtnClicked(${post.id})">Delete</button>
        `
      

      // console.log(post.id)
      let content = `
      <!--POsts-->
      <div class="col-9 post mt-3 " data-id="${post.id}">
        <div class="card p-2" style="width: 100%;">
          <header class="header mb-2 pb-2 border-bottom">
            <img src="${parsePostImages(author.profile_image, dummyImageUrl)}" alt="" class="user-img rounded rounded-circle border border-3 " style="width:40px; height:40px; object-fit: cover; object-position:top">
            <span class="user-name">${author.username}</span>
            <span class="edit-delete-box" style="float:right">
              ${contentEditDelete}
            </span>
          </header>
          <img  onclick="userImageClicked(this)" src="${parsePostImages(post.image, dummyImageUrl)}" class="post-img card-img-top mt-2 w-100" style=" border-radius:unset;object-fit: cover;" >
          <p class="post-time" style="color: #919090; font-weight:600">${post.created_at}</p>
          <div class="card-body p-0">
            <h5 class="post-title" style="font-weight:600" >${postTitle}</h5>
            <p class="post-content mb-2 pb-2 border-bottom">${post.body}.</p>
          
            <!-- footer -->
            <footer class="post-footer d-flex align-items-center py-3" style="gap:15px;">
              <div class="card-comments" style="width:200px; ">
                <i class="bi bi-pen"></i>
                <span class="post-comment-number">(${post.comments_count})</span>  ${parsePostComments(post.comments_count)}
              </div>
              <div class="post-tags w-100 d-flex flex-wrap" style="gap:5px">
              ${tagsContent}
              </div>
            </footer>
            <!-- footer -->
          </div>
        </div>
      </div>
      <!--POst-->
      `
      
      posts.innerHTML += content;
    }
  }
}

window.onload = function(){
  displayUserInfo();
  updateUi()
  getPosts()
}