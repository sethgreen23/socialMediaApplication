
let currentPage = 1;
let lastPage = 1;
/**
 * 
 * Function calls
 */
init();


/**
 * 
 * Function definition
 */
//
function init(){
  updateUi()
  getPosts(currentPage)
}
//get postss
function getPosts(currentPage, reload=true){
  
  // GET request for remote image in node.js

  axios({
    method: 'get',
    url: `${baseUrl}/posts?page=${currentPage}&limit=3`,
  })
    .then(function (response) {
      let postsData = response.data.data;
      lastPage = response.data.meta.last_page;
      showPosts(postsData, reload);
    });
}
//show posts
function showPosts(postsData, reload){
  let posts = document.querySelector(".posts");
  if(reload){
    posts.innerHTML = "";

  }
  for(let post of postsData){
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
   
    let localUser = JSON.parse(localStorage.getItem("user"));
    // console.log({"local":localUser,"author":post.author})
    if(localUser && localUser.id == post.author.id){
      console.log("yes")
      contentEditDelete = `
            <button class="btn btn-secondary" onclick="editPostBtnClicked('${encodeURI(JSON.stringify(post))}')">Edit</button>
            <button class="btn btn-danger" onclick="deletePostBtnClicked(${post.id})">Delete</button>
      `
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
    isInside = true;
  }
}

// //Register
// function register(){
//   let name = document.getElementById("register-name-input");
//   let username = document.getElementById("register-username-input");
//   let password= document.getElementById("register-password-input")
//   let image = document.getElementById("register-image-input").files[0];
//   let formData = new FormData();
//   formData.append("username", username.value)
//   formData.append("name", name.value)
//   formData.append("password", password.value)
//   formData.append("image", image)
//   // Send a POST request
//   axios.post(`${baseUrl}/register`,formData,
//   {
//     headers:{
//       'Content-Type': 'multipart/form-data',
//       'Accept':'application/json'
//     }
//   })
//   .then((response)=>{
//     console.log(response);
//     // save the token in local storage
//     localStorage.setItem("token",response.data.token);
//     localStorage.setItem("user", JSON.stringify(response.data.user))
//     let message = "User Registered successfuly";
//     let type = "success";
    
//     closeModal("registerModal");
//     showHideAlert(message, type)
//     showUserInfoNav(true,response.data.user)
//     updateUi()
//   })
//   .catch((error)=>{
//     // console.log(error)
//     // console.log(error)
//     let message = error.response.data.message;
//     let type = "danger";
    
//     closeModal("registerModal");
//     showHideAlert(message, type)
//     updateUi()
//   });

//   // username.value=""
//   // password.value=""

// }




/**
 * 
 * SCROLL EVENT
 */

let isInside = true;
window.addEventListener('scroll', (event)=>{
  const {scrollHeight,clientHeight,scrollTop} = document.documentElement;
  // console.log(document)
  // console.log({scrollHeight,clientHeight,scrollTop})
  if((scrollHeight-5<=clientHeight+scrollTop) && isInside && currentPage < lastPage){
    isInside = false;
    currentPage+=1;
    getPosts(currentPage,false)
  }
})



// this is how you attach event listener to a sertain element 
// that are dynamicly created
// document.addEventListener("click",(event)=>{
  
//   const targets = event.target.closest(".user-img"); // Or any other selector.
//    console.log(targets)
  // if(targets){
  //   const id = target.parentElement.parentElement.getAttribute("data-id");
  //   // console.log("fuck you man")
  //   // Do something with `target`.
    
  //   window.location.assign(`postDetails.html?id=${id}`);
  // }
// })

// random user profile redirect


