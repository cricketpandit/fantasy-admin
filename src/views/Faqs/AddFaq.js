import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import "react-datepicker/dist/react-datepicker.css";

import { useHistory } from "react-router-dom";
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';

const AddFaq = (props) => {
  const session = useSession();
  let history = useHistory();
  const alert = useAlert();
  const { register, handleSubmit, errors } = useForm();
  const [token] = useState(session.token);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState(EditorState.createEmpty());
  
  const onSubmit = async data => {
    setLoading(true);
    let formData = new FormData();
    let postJson = {
      question: data.question.trim(),
      answer: draftToHtml(convertToRaw(answer.getCurrentContent()))
    };
    formData.append('data', JSON.stringify(postJson));
    let path = apiUrl.add_faq;
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

  const onEditorStateChange = async (editorState) => {
    setAnswer(editorState);
  };
 

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="text-info"><h4>Add Faq</h4></CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <Label className={'col-md-2 pull-left mt-2'}>Faq Question</Label>
                  <input type="text" name="question" minLength={"3"} maxLength={"500"} placeholder="Question" autoComplete="off"
                    className="form-control col-md-8" ref={register({ required: 'Required' })} />
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
            <Button onClick={() => history.goBack()} className="dark_btn"><i className="fa fa-arrow-left" aria-hidden="true"></i> Back  </Button>
            <Button className={'ml-2'} type="submit" color="primary">Submit {loading === true ? <i className="fa fa-spinner fa-pulse fa-fw ml-1"></i> : <i className="fa fa-arrow-circle-right fa-lg" aria-hidden="true"></i>}</Button>
          </CardFooter>
        </Card>
      </form>
    </React.Fragment>
  );
}

export default AddFaq;
