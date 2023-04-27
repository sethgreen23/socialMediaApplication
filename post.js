
getPost();
updateUi()


// function updateUi(){
//   let token = localStorage.getItem("token");
//   console.log(token);
//   let btnLoginContainer = document.querySelector(".login-btn-container");
//   let btnLogoutContainer = document.querySelector(".logout-btn-container");
//   let addPostBtn = document.querySelector(".add-post-btn");
//   if(token == null){
//     btnLoginContainer.style.display = "block";
//     btnLogoutContainer.style.display = "none"
//     // addPostBtn.style.display = "none"
//   }else{
//     btnLoginContainer.style.display = "none";
//     btnLogoutContainer.style.display = "block"

//   }
//   addPostBtn.style.display = "none"
// }







//get postss
function getPost(){
  
  // GET request for remote image in node.js

  axios({
    method: 'get',
    url: `${baseUrl}/posts/${getPostId()}`,
  })
    .then(function (response) {
      let post = response.data.data;
      // console.log(post)
      showPost(post);

    });
}
//show posts
function showPost(post){
  let authorUsername= document.querySelector(".post-author-username")

  let posts = document.querySelector(".posts");
  posts.innerHTML = "";


  let author = post.author;
  authorUsername.innerHTML = `${author.username}' Post`
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
  let commentContent=""
  if(post.comments_count!=0){
    commentContent = createComments(post)
  }
  // console.log(post.id)
  let content = `
  <!--POsts-->
  <div class="col-9 post mt-3 " data-id="${post.id}">
    <div class="card p-2" style="width: 100%;">
      <header class="header mb-2 pb-2 border-bottom">
      <div onclick="userRedirectProfile(${author.id})" id="user-info-redirect" style="cursor:pointer">
      <img src="${parsePostImages(author.profile_image, dummyImageUrl)}" alt="" class="user-img rounded rounded-circle border border-3 " style="width:40px; height:40px; object-fit: cover; object-position:top">
      <span class="user-name">${author.username}</span>
    </div>
      </header>
      <img  src="${parsePostImages(post.image, dummyImageUrl)}" class="post-img card-img-top mt-2 w-100" style=" border-radius:unset;object-fit: cover;" >
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
        ${commentContent}`;
        
        let token = localStorage.getItem("token");
        if(token){
          content+=`
          <div class="input-group mb-3">
            <input type="text" class="form-control comment-input" placeholder="Comment" aria-label="Recipient's username" aria-describedby="button-addon2">
            <button class="btn btn-outline-primary" type="button" id="button-addon2" onclick="addComment()">Send</button>
          </div>
          `;
        }
        

        content+=`
        <!-- footer -->
      </div>
    </div>
  </div>
  <!--POst-->
  `
  
  posts.innerHTML += content;
  
  
}

function createComments(post){
  // console.log(post)
  
  let contents  = "";
  for(let comment of post.comments){
    let content = `
    <!-- COMMENT -->
    <div class="comment mt-5">
      <div class="comment-header  d-flex mb-3" style="column-gap:10px;align-items:center">
        <img style="width:40px; height:40px; object-fit: cover;"  class="comment-author-img rounded-circle border border-3" src=${comment.author.profile_image} alt="">
        <span class="comment-author-name fw-bold">${comment.author.username}</span>
      </div>
      <div class="comment-body">
        <p class="comment-text fs-6" >${comment.body}</p>
      </div>

    </div> 
    <!-- //COMMENT// -->
    `
    contents+=content;
  }
  let commentsContainer = `
  
  <!-- COMMENTS -->
  <div class="comments-container p-3" style="margin-block:20px;background:#EFF5FF;">
    
    ${contents}
  </div>
  <!-- //COMMENTS// -->
  `;
  return commentsContainer;
}
function getPostId(){
  // Create urlParams query string
  const urlParams = new URLSearchParams(window.location.search);
  // console.log(urlParams)
  // Get value of single parameter
  return urlParams.get('id');
}


// console.log(JSON.parse(localStorage.getItem("user")))

function addComment(){
  // check for the 
  let commentInput= document.querySelector(".comment-input")
  let postId = document.querySelector(".post").getAttribute("data-id");
  let token = localStorage.getItem("token");

  let body = {
    "body":commentInput.value
  }

  // let headersData = new Headers();
  axios.post(`${baseUrl}/posts/${postId}/comments`
    ,body,{
      headers:{
        'Content-Type': 'multipart/form-data',
        'Accept':'application/json',
        'Authorization':`Bearer ${token}`
      }} )
      .then((response)=>{
        let message = "Comment added successfuly";
        let type = "success";
        
        
        showHideAlert(message, type)
        getPost()
      })
      .catch((error)=>{
        let message = error.response.data.message;
        let type = "danger";
        
        showHideAlert(message, type)
      });
}