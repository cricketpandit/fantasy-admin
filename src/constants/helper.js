import axios from 'axios';


const helper = {
  post: async ( token, jsonObj = {}, path = "") => {
    
    const url = process.env.REACT_APP_API_BASE_URL + path;
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(jsonObj),
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token || ''
      }
    });

    if (res.status === 403) {
      localStorage.setItem('user_inactive', "inactive");
      window.location = '/login';
      return;
    }
     

    return { response:  res, status: res.status };
  },

  get: async (token, path = "") => {
    const url = process.env.REACT_APP_API_BASE_URL + path;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", "x-access-token": token || ''
      }
    }); 

    if (res.status === 403) {
      localStorage.setItem('user_inactive', "inactive");
      window.location = '/login';
      return;
    }

    if (res.status === 401) {
      localStorage.removeItem("ons-app");
      localStorage.removeItem("IsLogin");
      localStorage.removeItem("username");
      window.location = '/login';
    }

   
    return { response: res, status: res.status };
  },
  pointGet: async (token, path = "") => {
    const url = process.env.REACT_APP_IMAGE_BASE_URL + path;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", "x-access-token": token || ''
      }
    }); 

    if (res.status === 403) {
      localStorage.setItem('user_inactive', "inactive");
      window.location = '/login';
      return;
    }

    if (res.status === 401) {
      localStorage.removeItem("ons-app");
      localStorage.removeItem("IsLogin");
      localStorage.removeItem("username");
      window.location = '/login';
    }

   
    return { response: res, status: res.status };
  },

  put: async (token,jsonObj = {}, path = "") => {

    const url = process.env.REACT_APP_API_BASE_URL + path;
    const res = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(jsonObj),
      headers: {
        "Content-Type": "application/json", "x-access-token": token || ''
      }
    });

    if (res.status === 403) {
      localStorage.setItem('user_inactive', "inactive");
      window.location = '/login';
      return;
    }

    return { response: res, status: res.status };
  },
  delete: async (token,path = "") => {

    const url = process.env.REACT_APP_API_BASE_URL + path;
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json", "x-access-token": token || ''
      }
    });

    if (res.status === 403) {
      localStorage.setItem('user_inactive', "inactive");
      window.location = '/login';
      return;
    }

    return { response: res, status: res.status };
  },
  axios_get: async (jsonObj = {}, path = "", session = {}) => {
    let query = await helper.serialize(jsonObj);
    const url = process.env.REACT_APP_API_BASE_URL + path + "?" + query;
    const res = await axios(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", "x-access-token": session.token || ''
      }
    });

    if (res.status === 403) {
      localStorage.setItem('user_inactive', "inactive");
      window.location = '/login';
      return;
    }
    
    if (res.status === 401) {
      localStorage.removeItem("honeywell-app");
      window.location = '/login';
    }
    return res;
  },
  serialize: function (obj, prefix) {
    let str = [],p;
    for (p in obj) {
      if (obj.hasOwnProperty(p)) {
        let k = prefix ? prefix + "[" + p + "]" : p,
          v = obj[p];
        str.push((v !== null && typeof v === "object") ?
          this.serialize(v, k) :
          encodeURIComponent(k) + "=" + encodeURIComponent(v));
      }
    }
    return str.join("&");
  }, 

  getip: async (path = "") => {
    const url = path;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    return { response: res, status: res.status };
  },
  getIPAddress: async () => {
    const fr = await fetch('https://api.ipify.org/?format=json');
    const res = await fr.json();
    if (fr.status === 200) {
      return res.ip;
    } else {
      return null;
    }
  },
  formPost: async (token,jsonObj = {}, path = "") => {

    const url = process.env.REACT_APP_API_BASE_URL + path;
    const res = await fetch(url, {
      method: "POST",
      body: jsonObj,
      headers: {
        "x-access-token": token || ''
      }
    });
    return { response: res, status: res.status };
  },
  SwalConfig: (message = "You want to change status") => {
    return {
      title: 'Are you sure?',
      text: message,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true
    }
  },
  SwalDateConfig: (message = "You want to extend the time") => {
    return {
      title: 'Are you sure?',
      text: message,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true
    }
  },
  andOperator:(firstCondition,secondCondition)=>{
    return firstCondition && secondCondition
  },
  ternaryOperator :(condition,firstCondition,secondCondition)=>{
    return condition ? firstCondition : secondCondition
  },
  orOperator :(firstCondition,secondCondition)=>{
    return firstCondition ||  secondCondition
  }
}

export default helper;


