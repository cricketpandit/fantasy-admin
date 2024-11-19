import React, { useState, useEffect } from "react";
import {  useForm } from "react-hook-form";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardFooter,
  FormGroup,
  Label,
  Col,
  Row,
} from "reactstrap";
import Helper from "../../constants/helper";
import apiUrl from "../../constants/apiPath";
import useSession from "react-session-hook";
import { useAlert } from "react-alert";
const Merchandise = () => {
  const session = useSession();
  const alert = useAlert();
  const [settingData, setSettingData] = useState({
    referral_amount: 0,
    contest_admin_commission: 0,
    pool_contest_admin_commission: 0,
    quiz_admin_commission: 0,
  });

  const { register, reset, handleSubmit } = useForm();
  const [token] = useState(session.token);
  const [issubmit, setIsubmit] = useState(false);
  const module =
    session.profile.user_type == "editor"
      ? session.profile.permissions.find((e) => e.manager === "Settings")
      : {};
  const { user_type } = session.profile;
   const onSubmit = async (data) => {
    setIsubmit(true);
     let postJson = {
      first_rank: data.first_rank,
      second_rank: data.second_rank,
      third_rank: data.third_rank,
      fourth_rank: data.fourth_rank,
      fifth_rank: data.fifth_rank,
      sixth_rank: data.sixth_rank,
      seventh_rank: data.seventh_rank,
      eirth_rank: data.eirth_rank,
      ninth_rank: data.ninth_rank,
      tenth_rank: data.tenth_rank
    };
     let path = apiUrl.update_merchindise;
    const fr = await Helper.post(token,postJson, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        getSettings();
        setIsubmit(false);
        alert.success(res.msg);
      } else {
        alert.error(res.msg);
        setIsubmit(false);
      }
    } else {
      alert.error(res.error);
      setIsubmit(false);
    }
  };

  const getSettings = async (id) => {
    let path = apiUrl.get_setting;
    const fr = await Helper.get(token,path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setSettingData(res.results || []);
      } else {
        alert.error(res.msg);
      }
    } else {
      alert.error(res.error);
    }
  };

  useEffect(() => {
    reset();  
    getSettings();
  }, []);

  return (
    <div>
      <Card className="card_theme">
        <CardHeader>
          <CardTitle className="">
            <h5>Merchendise</h5>
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <CardBody>
            <Row>
            <Col md={6}>
                <FormGroup>
                  <Label className={"col-md-4 pull-left mt-2"}>
                    First Rank Award
                  </Label>
                  <div className="input-group col-md-6">
                    <input
                      defaultValue={settingData?.first_rank}
                      maxLength={30}
                      ref={register}
                      id="first_rank"
                      name="first_rank"
                      placeholder="First Rank Award"
                      type="text"
                      className="form-control"
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">
                        <i className="fa fa-code"></i>
                      </span>
                    </div>
                  </div>
                </FormGroup>
              </Col>
            <Col md={6}>
                <FormGroup>
                  <Label className={"col-md-4 pull-left mt-2"}>
                    Second Rank Award
                  </Label>
                  <div className="input-group col-md-6">
                    <input
                      defaultValue={settingData?.second_rank}
                      maxLength={30}
                      ref={register}
                      id="second_rank"
                      name="second_rank"
                      placeholder="Second Rank Award"
                      type="text"
                      className="form-control"
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">
                        <i className="fa fa-code"></i>
                      </span>
                    </div>
                  </div>
                </FormGroup>
              </Col>
            <Col md={6}>
                <FormGroup>
                  <Label className={"col-md-4 pull-left mt-2"}>
                    Third Rank Award
                  </Label>
                  <div className="input-group col-md-6">
                    <input
                      defaultValue={settingData?.third_rank}
                      maxLength={30}
                      ref={register}
                      id="third_rank"
                      name="third_rank"
                      placeholder="Third Rank Award"
                      type="text"
                      className="form-control"
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">
                        <i className="fa fa-code"></i>
                      </span>
                    </div>
                  </div>
                </FormGroup>
              </Col>
            <Col md={6}>
                <FormGroup>
                  <Label className={"col-md-4 pull-left mt-2"}>
                    Fourth Rank Award
                  </Label>
                  <div className="input-group col-md-6">
                    <input
                      defaultValue={settingData?.fourth_rank}
                      maxLength={30}
                      ref={register}
                      id="fourth_rank"
                      name="fourth_rank"
                      placeholder="Fourth Rank Award"
                      type="text"
                      className="form-control"
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">
                        <i className="fa fa-code"></i>
                      </span>
                    </div>
                  </div>
                </FormGroup>
              </Col>
            <Col md={6}>
                <FormGroup>
                  <Label className={"col-md-4 pull-left mt-2"}>
                    Fifth Rank Award
                  </Label>
                  <div className="input-group col-md-6">
                    <input
                      defaultValue={settingData?.fifth_rank}
                      maxLength={30}
                      ref={register}
                      id="fifth_rank"
                      name="fifth_rank"
                      placeholder="Fifth Rank Award"
                      type="text"
                      className="form-control"
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">
                        <i className="fa fa-code"></i>
                      </span>
                    </div>
                  </div>
                </FormGroup>
              </Col>
            <Col md={6}>
                <FormGroup>
                  <Label className={"col-md-4 pull-left mt-2"}>
                    Sixth Rank Award
                  </Label>
                  <div className="input-group col-md-6">
                    <input
                      defaultValue={settingData?.sixth_rank}
                      maxLength={30}
                      ref={register}
                      id="sixth_rank"
                      name="sixth_rank"
                      placeholder="Sixth Rank Award"
                      type="text"
                      className="form-control"
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">
                        <i className="fa fa-code"></i>
                      </span>
                    </div>
                  </div>
                </FormGroup>
              </Col>
            <Col md={6}>
                <FormGroup>
                  <Label className={"col-md-4 pull-left mt-2"}>
                    Seventh Rank Award
                  </Label>
                  <div className="input-group col-md-6">
                    <input
                      defaultValue={settingData?.seventh_rank}
                      maxLength={30}
                      ref={register}
                      id="seventh_rank"
                      name="seventh_rank"
                      placeholder="Seventh Rank Award"
                      type="text"
                      className="form-control"
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">
                        <i className="fa fa-code"></i>
                      </span>
                    </div>
                  </div>
                </FormGroup>
              </Col>
            <Col md={6}>
                <FormGroup>
                  <Label className={"col-md-4 pull-left mt-2"}>
                    Eirth Rank Award
                  </Label>
                  <div className="input-group col-md-6">
                    <input
                      defaultValue={settingData?.eirth_rank}
                      maxLength={30}
                      ref={register}
                      id="eirth_rank"
                      name="eirth_rank"
                      placeholder="Eirth Rank Award"
                      type="text"
                      className="form-control"
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">
                        <i className="fa fa-code"></i>
                      </span>
                    </div>
                  </div>
                </FormGroup>
              </Col>
            <Col md={6}>
                <FormGroup>
                  <Label className={"col-md-4 pull-left mt-2"}>
                    Ninth Rank Award
                  </Label>
                  <div className="input-group col-md-6">
                    <input
                      defaultValue={settingData?.ninth_rank}
                      maxLength={30}
                      ref={register}
                      id="ninth_rank"
                      name="ninth_rank"
                      placeholder="Ninth Rank Award"
                      type="text"
                      className="form-control"
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">
                        <i className="fa fa-code"></i>
                      </span>
                    </div>
                  </div>
                </FormGroup>
              </Col>
            <Col md={6}>
                <FormGroup>
                  <Label className={"col-md-4 pull-left mt-2"}>
                    Thenth Rank Award
                  </Label>
                  <div className="input-group col-md-6">
                    <input
                      defaultValue={settingData?.tenth_rank}
                      maxLength={30}
                      ref={register}
                      id="tenth_rank"
                      name="tenth_rank"
                      placeholder="Thenth Rank Award"
                      type="text"
                      className="form-control"
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">
                        <i className="fa fa-code"></i>
                      </span>
                    </div>
                  </div>
                </FormGroup>
              </Col>
            </Row>
          </CardBody>
          <CardFooter>
            {(user_type === "editor" && module.edit === 1) ||
              user_type === "admin" ? (
              <Button type="submit" color="primary">
                Submit{" "}
                {issubmit === true && (
                  <i className="fa fa-spinner fa-pulse fa-fw ml-1"></i>
                )}
              </Button>
            ) : null}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Merchandise;
