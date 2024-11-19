import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import "react-datepicker/dist/react-datepicker.css";

import Helper from '../../constants/helper';
import { useHistory } from "react-router-dom";
import apiUrl from '../../constants/apiPath';
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';


const EditFaq = (props) => {
  const session = useSession();
  let history = useHistory();
  const alert = useAlert();
  const { register, handleSubmit, errors } = useForm();
  const [token] = useState(session.token);
  const [loading, setLoading] = useState(false);
   const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(EditorState.createEmpty());
  const [id, setId] = useState('');

  const onSubmit = async data => {
    setLoading(true);
    let formData = new FormData();
    let postJson = {
      id: id,
      question: data.question.trim(),
       answer: draftToHtml(convertToRaw(answer.getCurrentContent()))
    };
    formData.append('data', JSON.stringify(postJson));
    let path = apiUrl.update_faq;
    const fr = await Helper.post(token,postJson, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setLoading(false);
        props.history.push('/faqs');
        alert.success(res.msg);
      } else {
        alert.error(res.msg);
        setLoading(false);
      }
    } else {
      alert.error(res.error);
      setLoading(false);
    }
  };

  const getData = async () => {
    let path = apiUrl.get_faq + '/' + `${props.match.params.id}`;
    const fr = await Helper.get(token,path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setQuestion(res.results.question);
         const contentBlock = htmlToDraft(res.results.answer);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            console.log(editorState);
            setAnswer(editorState);
        }
        setId(res.results.id);
      } else {
        alert.error(res.msg);
        return false;
      }
    } else {
      console.log(res.msg);
    }
  };

  const onEditorStateChange = async (editorState) => {
    setAnswer(editorState);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
 
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className=""><h4>Edit Faq</h4></CardTitle>
          </CardHeader>
          <CardBody>
          <Row>
              <Col md={12}>
                <FormGroup>
                  <Label className={'col-md-2 pull-left mt-2'}>Faq Question</Label>
                  <input type="text" name="question" minLength={"3"} maxLength={"500"} placeholder="Question" autoComplete="off"
                    className="form-control col-md-8" defaultValue={question}  ref={register({ required: 'Required' })} />
                  {errors.title && <p className="text-danger marginmessage">Faq question is required</p>}
                </FormGroup>
              </Col>
              <Col md={12}>
              <FormGroup>
                  <Label>Faq Answer</Label>
                  <Editor
                      editorState={answer}
                      toolbarClassName="toolbarClassName"
                      wrapperClassName="wrapperClassName"
                      editorClassName="editorClassName"
                      onEditorStateChange={onEditorStateChange}
                      required
                  />
              </FormGroup>
              </Col>
            </Row>
          </CardBody>
          <CardFooter>
            <Button onClick={() => history.goBack()} className="btn dark_btn ml-1" color="danger"><i className="fa fa-arrow-left" aria-hidden="true"></i> Back  </Button>
            <Button className={'ml-2'} type="submit" color="primary">Submit {loading === true ? <i className="fa fa-spinner fa-pulse fa-fw ml-1"></i> : <i className="fa fa-arrow-circle-right fa-lg" aria-hidden="true"></i>}</Button>
          </CardFooter>
        </Card>
      </form>
  
  );
}

export default EditFaq;
