import React, { useState, useEffect } from 'react';
 import Helper from '../../constants/helper';
 import apiUrl from '../../constants/apiPath';
  import useSession from 'react-session-hook';
import AddQuestion from "./AddQuestion"
const EditQuestion = (props) => {
  const session = useSession();
  const [token] = useState(session.token);
  const getCategory = async () => {
    
    let path = apiUrl.get_active_categories;
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        console.log("res.success",res.success)
      } else {
        console.log(res.msg);
      }
    } else {
      console.log(res.error);
    }
  }
  const getQuizByCat = async (type,selectedCat) => {
    
    let path = (type == 'quiz') ? apiUrl.get_quiz_by_category + '/' + selectedCat : apiUrl.get_contest_by_category + '/' + selectedCat;
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        console.log("success")
      } else {
        console.log(res.msg);
      }
    } else {
      console.log(res.error);
    }
  }

  const getData = async () => {
 
    let path = apiUrl.get_question + '/' + `${props.match.params.id}`;
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        getQuizByCat(res.results.question_mode,res.results.category_id)
      } else {
        console.log(res.msg);
      }
    } else {
      console.log(res.msg);
    }
  };
  useEffect(() => {
    getCategory();
    getData();
  }, []);

  return (
 
    <AddQuestion id={props.match.params.id} ></AddQuestion>
   
  );
}

export default EditQuestion;
