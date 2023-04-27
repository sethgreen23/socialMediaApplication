// comment property
// get posts
let dummyImageUrl = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
// variables

const baseUrl = "https://tarmeezacademy.com/api/v1"



// changing the navbuttons depending on the user is logedin or out
function updateUi(){
  let token = localStorage.getItem("token");
  let btnLoginContainer = document.querySelector(".login-btn-container");
  let btnLogoutContainer = document.querySelector(".logout-btn-container");
  let addPostBtn = document.querySelector(".add-post-btn");
  let profileBtn = document.querySelector(".profile-link")
  if(token == null){
    btnLoginContainer.style.display = "block";
    btnLogoutContainer.style.display = "none"
    profileBtn.style.display = "none"
    if(addPostBtn!=null)
    addPostBtn.style.display = "none"
    
  }else{
    btnLoginContainer.style.display = "none";
    btnLogoutContainer.style.display = "block"
    profileBtn.style.display = "block"
    if(addPostBtn!=null)
      addPostBtn.style.display = "block"
    
  }

}


// show user information
function showUserInfoNav(isLogged=false,user=false){
  let userImage = document.querySelector(".logout-user-img");
  let userName = document.querySelector(".logout-user-name");

  if(isLogged){
    userImage.src = isEmptyObject(user.profile_image)?dummyImageUrl:user.profile_image;
    userName.innerHTML=user.username;
  }
}
// object is empty
function isEmptyObject(obj) {
  console.log(Object.keys(obj).length)
  return !Object.keys(obj).length;
}

//login
function login(){
  let username = document.getElementById("login-input");
  let password= document.getElementById("password-input")
  // Send a POST request
  axios({
    method: 'post',
    url: `${baseUrl}/login`,
    data: {
      "username" : username.value,
      "password" : password.value
    } 
  })
  .then((response)=>{
    // console.log(response.data.token,response.data.user);
    // save the token in local storage
    localStorage.setItem("token",response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user))
    let message = "User logged in successfuly";
    let type = "success";
    
    closeModal("loginModal");
    // show the alert and hide it
    // add transition to the parent element
    // new Promise((resolve,reject)=>{
      
    //     showAlertSuccess(message, type);
    //     resolve();
    // })
    // .then((response)=>{
    //   setTimeout(() => {
    //     let parentAlert = document.getElementById("alertUser");
    //     parentAlert.removeChild(document.querySelector(".parentAlert"));
    //   }, 2000);
    // })
    showHideAlert(message, type)
    showUserInfoNav(true,response.data.user)
    updateUi();
    // check if the user is loged in our out the postdetail
    // to show or hide the commment field
    if(getPageName()=="postDetails"){
      getPost();
    }else if(getPageName()=="index"){
      getPosts();
    }else if(getPageName()=="profile_random"){
      getPostsRandom();
    }
  })
  .catch((error)=>{
    // console.log(error)
    // console.log(error.response.data.message)
    let message = error.response.data.message;
    let type = "danger";
    
    closeModal("loginModal");
    showHideAlert(message, type)
    updateUi()
  });

  // username.value=""
  // password.value=""

}
//logout
function logout(){
  // remove the token and user info from the local storage
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  let message = "User logged out successfully"
  let type = "success"
  console.log(getPageName())
  showHideAlert(message, type)
  if(getPageName()=="postDetails"){
    getPost();
  }else if(getPageName()=="index"){
    getPosts();
  }else if(getPageName()=="profile_random"){
    
    getPostsRandom();
  }
  updateUi()
  
  
}


//Register
function register(){
  let name = document.getElementById("register-name-input");
  let username = document.getElementById("register-username-input");
  let password= document.getElementById("register-password-input")
  let image = document.getElementById("register-image-input").files[0];
  let formData = new FormData();
  formData.append("username", username.value)
  formData.append("name", name.value)
  formData.append("password", password.value)
  formData.append("image", image)
  // Send a POST request
  axios.post(`${baseUrl}/register`,formData,
  {
    headers:{
      'Content-Type': 'multipart/form-data',
      'Accept':'application/json'
    }
  })
  .then((response)=>{
    // console.log(response);
    // save the token in local storage
    localStorage.setItem("token",response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user))
    let message = "User Registered successfuly";
    let type = "success";
    
    closeModal("registerModal");
    showHideAlert(message, type)
    showUserInfoNav(true,response.data.user)
    updateUi()
  })
  .catch((error)=>{
    // console.log(error)
    // console.log(error)
    let message = error.response.data.message;
    let type = "danger";
    
    closeModal("registerModal");
    showHideAlert(message, type)
    updateUi()
  });

  // username.value=""
  // password.value=""

}

//create post btn
function createPostBtnClicked(){

  document.querySelector(".hidden-create-input").setAttribute("data-post-id","");
  document.querySelector(".create-modal-title").innerHTML = "Create Post";
  document.querySelector("#add-post-title").value = "";
  document.querySelector("#add-post-content").value = "";
  document.querySelector("#add-post-content").value = "";
  document.querySelector(".create-post-btn").innerHTML = "Create Post";
  const myModal = new bootstrap.Modal(document.getElementById('addPostModal'), {});
  myModal.toggle();
}

//CREATE A POST
function createPost(){
  let postIdEdit = document.querySelector(".hidden-create-input").getAttribute("data-post-id");
  let title = document.getElementById("add-post-title");
  let content = document.getElementById("add-post-content");
  let image= document.getElementById("add-post-image-input")
  let token = localStorage.getItem("token");

  let myHeader = {
    'Content-Type': 'multipart/form-data',
    'Accept':'application/json',
    'Authorization':`Bearer ${token}`
  };
  // myHeader.append('Content-Type', 'multipart/form-data')
  // myHeader.append('Accept','application/json')
  // myHeader.append('Authorization',`Bearer ${token}`)

  let formData = new FormData();
  let postTitle = title.value? title.value:"Post title";
  let postContent = content.value?content.value:"Post content";

  formData.append("title", postTitle)
  formData.append("body",postContent)
  formData.append("image", image.files[0])

  let isPostIdEmpty = postIdEdit==null || postIdEdit=="" ;
  console.log("Is postid empty =====> "+ isPostIdEmpty)
  if(isPostIdEmpty){
    axios.post(`${baseUrl}/posts`
    ,formData,{
      headers:myHeader} )
      .then((response)=>{
        // console.log(response.text());
        // // save the token in local storage
        // localStorage.setItem("token",response.data.token);
        // localStorage.setItem("user", JSON.stringify(response.data.user))
        
        let message = "Post added successfuly";
        let type = "success";
        
        closeModal("addPostModal");
        showHideAlert(message, type)
        // getposts change
        currentPage =1
        getPosts(currentPage);
      })
      .catch((error)=>{
        // console.log(error)
        // console.log(error)
        let message = error.response.data.message;
        let type = "danger";
        
        closeModal("addPostModal");
        showHideAlert(message, type)
      });
  }else{
    console.log(postIdEdit)
    // myHeader.append("_method", "PUT")
    formData.append("_method", "PUT");
    console.log(myHeader)
    axios.post(`${baseUrl}/posts/${postIdEdit}`
    ,formData,{
      headers:myHeader} )
      .then((response)=>{
        // console.log(response.text());
        // // save the token in local storage
        // localStorage.setItem("token",response.data.token);
        // localStorage.setItem("user", JSON.stringify(response.data.user))
        let message = "Post Edited successfuly";
        let type = "success";
        
        closeModal("addPostModal");
        showHideAlert(message, type)
        if(getPageName()=="profile"){
          getPosts()
        }else{
          // getposts change
        currentPage =1
        getPosts(currentPage);
        }
      })
      .catch((error)=>{
        // console.log(error)
        // console.log(error)
        let message = error.response.data.message;
        let type = "danger";
        
        closeModal("addPostModal");
        showHideAlert(message, type)
      });
  }
  

  

  

 

  // Send a POST request
  // axios({
  //   method: 'post',
  //   url: `${baseUrl}/posts`,
  //   data: {
  //     "username" : username.value,
  //     "password" : password.value,
  //     "name" : name.value
  //   } 
  // })
  // .then((response)=>{
  //   console.log(response);
  //   // save the token in local storage
  //   localStorage.setItem("token",response.data.token);
  //   localStorage.setItem("user", JSON.stringify(response.data.user))
  //   let message = "User Registered successfuly";
  //   let type = "success";
    
  //   closeModal("registerModal");
  //   showHideAlert(message, type)
  //   showUserInfoNav(true,response.data.user)
  //   updateUi()
  // })
  // .catch((error)=>{
  //   // console.log(error)
  //   console.log(error)
  //   let message = error.response.data.message;
  //   let type = "danger";
    
  //   closeModal("registerModal");
  //   showHideAlert(message, type)
  //   updateUi()
  // });

  // username.value=""
  // password.value=""

}
function userImageClicked(element){
  // console.log()
  let target = element.parentElement.parentElement;
  if(target){
    const id = target.getAttribute("data-id");
    
    window.location.assign(`postDetails.html?id=${id}`);
  }
}

function deletePostBtnClicked(id){
  // alert(id)
  document.querySelector(".deletePostInput").setAttribute("data-delete-id",id);
  const myModal = new bootstrap.Modal(document.getElementById('deleteModal'), {});
  myModal.toggle();
}
function deletePost(){
  let id = document.querySelector(".deletePostInput").getAttribute("data-delete-id");
  // alert(id);
  // let data = {
  //   "body": "hello sdffsdsfds"
  //   }
  let token = localStorage.getItem("token")
  axios.delete(`${baseUrl}/posts/${id}`,
    {
      headers:{
        "Accept": "application/json",
        'Authorization':`Bearer ${token}`
      }
    }
  ).then((response)=>{
    // console.log(response.text());
    // // save the token in local storage
    // localStorage.setItem("token",response.data.token);
    // localStorage.setItem("user", JSON.stringify(response.data.user))
    let message = "Post deleted successfuly";
    let type = "success";
    
    closeModal("deleteModal");
    showHideAlert(message, type)
    if(getPageName()=="profile"){
      getPosts()
    }else{
      // getposts change
    currentPage =1
    getPosts(currentPage);
    }
    
  })
  .catch((error)=>{
    // console.log(error)
    // console.log(error)
    let message = error.response.data.message;
    let type = "danger";
    
    closeModal("deleteModal");
    showHideAlert(message, type)
  });
}
function editPostBtnClicked(post){
  let postObj = JSON.parse(decodeURI(post));
  console.log(postObj)
  document.querySelector(".hidden-create-input").setAttribute("data-post-id",postObj.id);
  document.querySelector(".create-modal-title").innerHTML = "Edit Post";
  document.querySelector("#add-post-title").value = postObj.title;
  document.querySelector("#add-post-content").value = postObj.body;
  document.querySelector("#add-post-content").value = postObj.body;
  document.querySelector(".create-post-btn").innerHTML = "Edit Post";
  const myModal = new bootstrap.Modal(document.getElementById('addPostModal'), {});
  myModal.toggle();


}
/**
 * 
 * Helper functions
 */

// helper funtions
function parsePostImages(url, dummyUrl){
  return typeof url=="string" &&  url!=""?url:dummyUrl
}
function parsePostComments(comments_count){
  return comments_count == 1?'Comment':'Comments'
}

//close modal
function closeModal(modalId){
  var myModalEl = document.getElementById(modalId);
  var modal = bootstrap.Modal.getInstance(myModalEl)
  modal.hide();
}

// show alert
function showAlert(message, type){
  new Promise((resolve,reject)=>{

    const alertUser = document.getElementById('alertUser')
    const appendAlert = (message, type) => {
      const wrapper = document.createElement('div')
      wrapper.classList.add("parentAlert")
      wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert" style="position:fixed;bottom:10px;right:10px;z-index:10">`,
        `   <div>${message}</div>`,
        '</div>'
      ].join('')
    
      alertUser.append(wrapper)
    }
    appendAlert(message, type)
    resolve();
  })
  
}

// show and hide the alert using promises and 
async function showHideAlert(message, type){
  let parentAlert = document.getElementById("alertUser");
  await showAlert(message, type);
  await new Promise((resolve, reject)=>{
    setTimeout(() => {
    
      document.querySelector(".alert").style.visibility="hidden";
      resolve();
    }, 2000);
  })
  setTimeout(()=>{
    let childElement = document.querySelector(".parentAlert")
    parentAlert.removeChild(childElement);

  },1000)

}

// detect if the url has changed
let prevUrl = undefined;
setInterval(() => {
  const currUrl = window.location.href;
  if (currUrl != prevUrl) {
    // URL changed
    prevUrl = currUrl;
    console.log(`URL changed to : ${currUrl}`);
    urlChangeUserFill()
  }
}, 60);

// detect if the there was a reload
const pageAccessedByReload = (
  (window.performance.navigation && window.performance.navigation.type === 1) ||
    window.performance
      .getEntriesByType('navigation')
      .map((nav) => nav.type)
      .includes('reload')
);

if(pageAccessedByReload){
  urlChangeUserFill()
}
function urlChangeUserFill(){
  // console.log(localStorage.getItem("user"))
  let token = localStorage.getItem("token");
  // console.log("Im reloading")
  if(token){
    let user = JSON.parse(localStorage.getItem("user"));
    showUserInfoNav(true,user)
  }
}

// get page name 
function getPageName(){
  // get the pathname of the page
  let path = window.location.pathname;
  // console.log(path)
  // get the page name with .html
  let page = path.split("/").pop();
  // console.log( page );
  // take away the .html usin regex
  response  = page.match(/\b(?!html\b)\w+/i)
  console.log(response)
  return response; 
}
console.log(localStorage.getItem("user"));

function userRedirectProfile(id){
  window.location.href = `profile_random.html?id=${id}`;
  // window.location.assign(`profile_random.html?id=${id}`);
}