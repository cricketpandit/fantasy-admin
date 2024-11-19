import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Helper from "../../constants/helper";
import { useHistory } from "react-router-dom";
import apiUrl from "../../constants/apiPath";
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, FormGroup, Label, Col, Row } from "reactstrap";
 import { useAlert } from "react-alert";
import useSession from "react-session-hook";
import moment from "moment";
 const AddQuestion = (props) => {
  const session = useSession();
  let history = useHistory();
  const alert = useAlert();
  const { register, handleSubmit, errors, setValue } = useForm();
  const [token] = useState(session.token);
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState(null);
  const [match_dropdown, setMatchDropdown] = useState([]);
  const [series_id, setSeriesId] = useState("");
  const [match_id, setMatchId] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [dropdown, setDropdown] = useState([]);
  const onSubmit = async (data) => {
    setLoading(true);
    let postJson = {
      question_text: data.question_text,
      optionA: data.optionA,
      optionB: data.optionB,
      optionC: data.optionC,
      optionD: data.optionD,
      type: data.type,
      categoryId: data.categoryId,
      timer: data?.timer,
      days: data?.days,
      hours: data?.hours,
      minutes: data?.minutes,
      bonus: data?.bonus,
      entryFee: data?.entryFee,

      id: props.id,
    };
    if (categoryName === "cricket") {
      postJson["series_id"] = series_id;
      postJson["match_id"] = match_id;
    }

    const formData = new FormData();
    formData.append("data", JSON.stringify(postJson));

    let path = props.id ? apiUrl.update_question : apiUrl.add_question;
    const fr = await Helper.formPost(token, formData, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setLoading(false);
        history.push("/questions");
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

  const getSeriesData = async () => {
    let path;
    path = apiUrl.get_upcoming_series;

    const fr = await Helper.get(token, path);
    const res = await fr.response.json();

    if (fr.status === 200) {
      if (res.success) {
        setDropdown(res.results || []);
      } else {
        alert.error(res.msg);
      }
    } else {
      alert.error(res.error);
    }
  };

  useEffect(() => {
    getSeriesData();
  }, []);

  const getMatchList = async (seriesId, matchId) => {
    setSeriesId(seriesId);
    let path;
    path = apiUrl.series_new_matches + "/" + `${seriesId}`;
    const fr = await Helper.get(token, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setMatchDropdown(res.results.docs || []);
        setMatchId(matchId);
      } else {
        alert.error(res.msg);
      }
    } else {
      alert.error(res.error);
    }
  };

  const handleChange = async (e) => {
    if (e.target.name === "series_id") {
      if (e.target.value == "") {
        setValue("optionA", "");
        setValue("optionB", "");
        setValue("optionADesc", "");
        setValue("optionBDesc", "");
        setMatchDropdown([]);
      }

      setValue("optionA", "");
      setValue("optionB", "");
      setValue("optionADesc", "");
      setValue("optionBDesc", "");
      let seriesId = e.target.value;
      setSeriesId(e.target.value);
      let path;
      path = apiUrl.series_new_matches + "/" + `${seriesId}`;

      const fr = await Helper.get(token, path);
      const res = await fr.response.json();

      if (fr.status === 200) {
        console.log("res", res);
        if (res.success) {
          setMatchDropdown(res.results.docs || []);
        } else {
          alert.error(res.msg);
        }
      } else {
        alert.error(res.error);
      }
    } else if (e.target.name === "match_id") {
      if (e.target.value == "") {
        setValue("optionA", "");
        setValue("optionB", "");
        setValue("optionADesc", "");
        setValue("optionBDesc", "");
      } else {
        setMatchId(e.target.value);
        getOtheroptions(e.target.value);
      }
    }
  };

  const getEditData = async (getIdMain) => {
    let path = apiUrl.get_question + "/" + getIdMain;
    
    const fr = await Helper.get(token, path);
 
    const res = await fr.response.json();
     
    if (fr.status === 200) {
      if (res.success) {
        const response = res.results;
       
        handleTypeChange(response?.type, response?.categoryId);
        if (Helper.andOperator(response?.series_id,response?.match_id)) {
          getMatchList(response?.series_id, response?.match_id);
        }
        setValue("question_text", response?.question_text);
        setValue("optionA", response?.optionA);
        setValue("optionB", response?.optionB);
        setValue("timer", response?.timer);
        setValue("days", response?.days);
        setValue("hours", response?.hours);
        setValue("minutes", response?.minutes);
        setValue("bonus", response?.bonus);
        setValue("type", response?.type);
        setValue("optionC", response?.optionC);
        setValue("optionD", response?.optionD);
        setValue("entryFee", response?.entryFee);
        getOtheroptions(response?.match_id);
      } else {
        console.log(res.msg);
      }
    } else {
      console.log(res.error);
    }
  };
  useEffect(() => {
    if (props?.id) {
      getEditData(props?.id);
    }
  }, [props?.id]);

  const getOtheroptions = async (getOtherId) => {
    let path = apiUrl.getMachTeams + "/" + getOtherId;

    const fr = await Helper.get(token, path);

    const res = await fr.response.json();

    if (fr.status === 200) {
      if (res.success) {
        const response = res.results;
        console.log("response", response);
      } else {
        console.log(res.msg);
      }
    } else {
      console.log(res.error);
    }
  };

  const handleTypeChange = async (value, categoryId) => {
    setSelectedType(value);
    let path;
    path = apiUrl.getQuizCategoryByType;

    const fr = await Helper.post(token, { type: value }, path);

    const res = await fr.response.json();

    if (fr.status === 200) {
      if (res.success) {
        setCategoryList(res?.results);
        setCategoryName(res?.results?.find((item) => item?._id === categoryId)?.title.toLowerCase());
        res?.results?.filter((item) => {
          if (item?._id == categoryId) {
            setValue("categoryId", item?._id);
          }
        });
      } else {
        alert.error(res.msg);
      }
    } else {
      alert.error(res.error);
    }
  };

  const handleSelectedCategory = (e) => {
    let categoryId = e.target.value;

    setCategoryName(categoryList?.find((item) => item?._id === categoryId)?.title.toLowerCase());
    setSeriesId(null);
    setMatchId(null);
  };

  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i + 1);


  const timmerDyamic = (lableName,name,arrayFields)=>{
   return <div className="input_grp  col-md-2">
    <select type="select" className="form-control" name={name} ref={register({})}>
      <option value="">{lableName}</option>
      <option value={0}>0</option>
      {arrayFields.map((number, index) => (
        <option key={index} value={number}>
          {number}
        </option>
      ))}
    </select>
  </div>
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
      <Card>
        <CardHeader>
          <CardTitle className="text-info">
            <h4>{Helper.ternaryOperator(props?.id, "Edit Question", "Add Question")}</h4>
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md={6}>
              <FormGroup className="row">
                <Label className={"col-md-3 pull-left mt-2"}>Type</Label>
                <div className="input_grp  col-md-6">
                  <select
                    type="select"
                    className="form-control"
                    disabled={props?.id}
                    name="type"
                    ref={register({
                      required: "Required",
                    })}
                    onChange={(e) => handleTypeChange(e.target.value)}
                  >
                    <option value="">Select Type</option>
                    <option value="liveEvent">Live Events</option>
                    <option value="perception">Perception</option>
                  </select>
                  {Helper.andOperator(errors.type, <p className="text-danger marginmessage">Type is required.</p>)}
                </div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="row">
                <Label className={"col-md-3 pull-left mt-2"}>Category</Label>
                <div className="input_grp  col-md-6">
                  <select
                    type="select"
                    className="form-control"
                    name="categoryId"
                    ref={register({
                      required: "Required",
                    })}
                    onChange={handleSelectedCategory}
                  >
                    <option value="">Select Category</option>
                    {categoryList?.map((item, i) => {
                      return (
                        <option key={i} value={item?._id}>
                          {item?.title}
                        </option>
                      );
                    })}
                  </select>
                  {Helper.andOperator(errors.categoryId, <p className="text-danger marginmessage">Category is required</p>)}
                </div>
              </FormGroup>
            </Col>

            {categoryName === "cricket" && (
              <>
                <Col md={6}>
                  <FormGroup className="row">
                    <Label className={"col-md-3 pull-left mt-2"}>Series</Label>
                    <div className="input_grp  col-md-6">
                      <select
                        className={"form-control"}
                        value={series_id}
                        name="series_id"
                        onChange={handleChange}
                        ref={register({ required: categoryName === "cricket" ? "Required" : "" })}
                      >
                        <option value={""}>Select Series</option>
                        {dropdown.map((innerType, index) => {
                          return (
                            <option key={index} value={innerType.id_api} selected={innerType.id_api === series_id}>
                              {innerType.name}
                            </option>
                          );
                        })}
                      </select>
                      {Helper.andOperator(errors.series_id, <p className="text-danger marginmessage">Series is required</p>)}
                    </div>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="row">
                    <Label className={"col-md-3 pull-left mt-2"}>Match</Label>
                    <div className="input_grp  col-md-6">
                      <select
                        className={"form-control"}
                        value={match_id}
                        name="match_id"
                        onChange={handleChange}
                        ref={register({ required: categoryName === "cricket" ? "Required" : "" })}
                      >
                        <option value={""}>Select Match</option>
                        {match_dropdown.map((item, index) => {
                          return (
                            <option key={index} value={item.match_id}>
                              {item.localteam} Vs {item.visitorteam} ( {moment(item.match_date).format("LLL")})
                            </option>
                          );
                        })}
                      </select>
                      {Helper.andOperator(errors.match_id, <p className="text-danger marginmessage">Match is required</p>)}
                    </div>
                  </FormGroup>
                </Col>
              </>
            )}
            <Col md={6}>
              <FormGroup className="row">
                <Label className={"col-md-3 pull-left mt-2"}>Question</Label>
                <div className="input_grp  col-md-6">
                  <textarea
                    name="question_text"
                    placeholder="Question"
                    autoComplete="off"
                    className="form-control "
                    ref={register({ required: "Required" })}
                  ></textarea>
                  {errors.question_text && <p className="text-danger marginmessage">Question is required</p>}
                </div>
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup className="row">
                <Label className={"col-md-3 pull-left mt-2"}>Timer</Label>
                {timmerDyamic("Day", "days", days)}
                {timmerDyamic("Hours", "hours", hours)}
                {timmerDyamic("Minutes", "minutes", minutes)}
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup className="row">
                <Label className={"col-md-3 pull-left mt-2"}>Bonus ( % ) </Label>
                <div className="input_grp  col-md-6">
                  <input
                    type="number"
                    name="bonus"
                    min="0"
                    max="99"
                    placeholder="Bonus ( % )"
                    autoComplete="off"
                    className="form-control"
                    ref={register({ required: "Required" })}
                  />
                  {Helper.andOperator(errors.bonus, <p className="text-danger marginmessage">Bonus is required</p>)}
                </div>
              </FormGroup>
            </Col>
            {selectedType === "perception" && (
              <Col md={6}>
                <FormGroup className="row">
                  <Label className={"col-md-3 pull-left mt-2"}>Entry Fee </Label>
                  <div className="input_grp  col-md-6">
                    <input
                      type="number"
                      name="entryFee"
                      min="1"
                      placeholder="Entry Fee."
                      autoComplete="off"
                      className="form-control"
                      ref={register({ required: selectedType === "perception" ? "Required" : "" })}
                    />
                    {Helper.andOperator(errors.timer, <p className="text-danger marginmessage">Entry fee is required</p>)}
                  </div>
                </FormGroup>
              </Col>
            )}
            <Col md={6}>
              <FormGroup className="row">
                <Label className={"col-md-3 pull-left mt-2"}>1st Option </Label>

                <div className="input_grp  col-md-6">
                  <input
                    type="text"
                    min="30"
                    max="180"
                    name="optionA"
                    placeholder="1st Option"
                    autoComplete="off"
                    className="form-control"
                    ref={register({ required: "Required" })}
                  />
                  {Helper.andOperator(errors.optionA, <p className="text-danger marginmessage">optionA is required</p>)}
                </div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="row">
                <Label className={"col-md-3 pull-left mt-2"}>2nd Option </Label>
                <div className="input_grp  col-md-6">
                  <input
                    type="text"
                    min="30"
                    max="180"
                    name="optionB"
                    placeholder="2nd Option"
                    autoComplete="off"
                    className="form-control"
                    ref={register({ required: "Required" })}
                  />
                  {Helper.andOperator(errors.optionB, <p className="text-danger marginmessage">optionB is required</p>)}
                </div>
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup className="row">
                <Label className={"col-md-3 pull-left mt-2"}>3rd Option</Label>
                <div className="input_grp  col-md-6">
                  <input
                    type="text"
                    min="30"
                    max="180"
                    name="optionC"
                    placeholder="3rd Option"
                    autoComplete="off"
                    className="form-control"
                    ref={register({ required: selectedType !== "liveEvent" ? "Required" : "" })}
                  />
                  {Helper.andOperator(errors.optionC, <p className="text-danger marginmessage">optionC is required</p>)}
                </div>
              </FormGroup>
            </Col>
            {Helper.andOperator(
              selectedType !== "liveEvent",
              <Col md={6}>
                <FormGroup className="row">
                  <Label className={"col-md-3 pull-left mt-2"}>4th Option</Label>
                  <div className="input_grp  col-md-6">
                    <input
                      type="text"
                      min="30"
                      max="180"
                      name="optionD"
                      placeholder="4th Option"
                      autoComplete="off"
                      className="form-control"
                      ref={register()}
                    />
                  </div>
                </FormGroup>
              </Col>
            )}
          </Row>
        </CardBody>
        <CardFooter>
          <Button onClick={() => history.goBack()} className="dark_btn">
            <i className="fa fa-arrow-left" aria-hidden="true"></i> Back{" "}
          </Button>
          <Button className={"ml-2"} type="submit" color="primary">
            Submit{" "}
            {Helper.ternaryOperator(
              loading === true,
              <i className="fa fa-spinner fa-pulse fa-fw ml-1"></i>,
              <i className="fa fa-arrow-circle-right fa-lg" aria-hidden="true"></i>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default AddQuestion;
