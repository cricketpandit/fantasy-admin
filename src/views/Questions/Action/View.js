import React, { useState, useEffect } from "react";
import Helper from "../../../constants/helper";
import apiUrl from "../../../constants/apiPath";
import { Button, Modal, ModalHeader, ModalBody, Label, FormGroup, Table } from "reactstrap";
import { useAlert } from "react-alert";
import useSession from "react-session-hook";

import _ from "lodash";

const View = (props) => {
  const { item, handleCloseModal, modal } = props;
  const session = useSession();
  const [poolsStats, setPoolStats] = useState([]);
  const [token] = useState(session.token);
  const [resultLoading, setResultLoading] = useState(false);
  const [questionAnswer, setAnswer] = useState(props?.item?.type == "perception" ? item?.answer : "");
  const alertPop = useAlert();

  const getPoolStats = async () => {
    let path;
    path = apiUrl.get_match_pool_stats;
    let jsonObj = {
      question_id: item?._id,
      match_id: item?.match_id,
    };
    const fr = await Helper.post(token, jsonObj, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setPoolStats(res.results || []);
      } else {
        alertPop.error(res.msg);
      }
    } else {
      alertPop.error(res.error);
    }
  };

  const handleResultData = async (itemId) => {
    setResultLoading(true);
    let path = `/crons/pool-winning-amount/?question_id=${props.item?._id}&answer=${questionAnswer}`;
     
    if (_.isEmpty(questionAnswer)) {
      alertPop.error(`Please select answer`);
      return false;
    }

    const fr = await Helper.get(token, path);
    const res = await fr.response.json();
    if (res?.success) {
      alertPop.success(res?.msg);
      handleCloseModal();
    } else {
      alertPop.error("Something went wrong, Please try again");
    }
    setResultLoading(false);
  };

  const handleChange = async (e) => {
    if (e.target.value != "") {
      setAnswer(e.target.value);
    }
  };
  useEffect(() => {
    if(item?._id){
    getPoolStats();
    }
    setAnswer(props?.item?.type == "perception" ? item?.answer : "");
  }, [props.item]);
  
  return (
    <div className={"inline-btn"}>
      <Modal
        isOpen={modal}
        toggle={(e) => {
          handleCloseModal();
        }}
        className="custom-modal modal-md viewModalCustome"
      >
        <ModalHeader
          toggle={(e) => {
            handleCloseModal();
          }}
        >
          View
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>
              <strong>Total no. of users joined the question</strong>
            </Label>
            <div>{poolsStats.totalUsers}</div>
          </FormGroup>
          <div>
            <Label>
              <strong>Total no. of users joined on a particular option.</strong>
            </Label>
            <div>
              <Table hover bordered responsive className="mt-0 text-center">
                <thead>
                  <tr>
                    <th>Option A</th>
                    <th>Option B</th>
                    {props.item?.optionC != "" && props.item?.optionC != undefined && <th>Option C</th>}
                    {props.item?.optionD != "" && props.item?.optionD != undefined && <th>Option D</th>}
                  </tr>
                </thead>
                <tbody>
                  <td>{poolsStats.totalOptionAContest}</td>
                  <td>{poolsStats.totalOptionBContest}</td>
                  {props.item?.optionC != "" && props.item?.optionC != undefined && <td>{poolsStats.totalOptionCContest}</td>}
                  {props.item?.optionD != "" && props.item?.optionD != undefined && <td>{poolsStats.totalOptionDContest}</td>}
                </tbody>
              </Table>
            </div>
          </div>

          <FormGroup>
            <Label>
              <strong>Pool Status</strong>
            </Label>
            <div>
              {Helper.ternaryOperator(props?.item?.isAmountDistributed == 1, "Completed", props?.item?.isCancelled == 1 ? "Cancelled" : "Open")}
            </div>
          </FormGroup>
          <FormGroup>
            <Label>
              <strong>Total amount</strong>
            </Label>
            <div>{poolsStats.completeTotalEntryFee}</div>
          </FormGroup>

          <FormGroup>
            <Label>
              <strong>Total no. of winners</strong>
            </Label>
            <div>{poolsStats.totalWinningUsers}</div>
          </FormGroup>

          <FormGroup>
            <Label>
              <strong>Total amount available for winning distribution</strong>
            </Label>
            <div>{poolsStats.totalEntryFee}</div>
          </FormGroup>

          <FormGroup>
            <Label>
              <strong>Total admin profit</strong>
            </Label>
            <div>{props?.item?.isCancelled == 0 ? poolsStats.adminProfit : 0}</div>
          </FormGroup>

          {/* <button type="button" className="btn dark_btn" data-dismiss="modal" onClick={(e) => {handleCloseModal()}}>Close</button> */}

          <div className="mb-2">
            <span className="me-2">Question : </span> {item?.question_text}
          </div>

          {props?.item?.isAmountDistributed != 1 ? (
            <div className="ans d-flex align-items-center w-100 py-3">
              <Label className={" mt-2 me-3"} style={{ marginRight: "10px" }}>
                Answer :{" "}
              </Label>
              <div className="input_grp">
                <select className={"form-control"} value={questionAnswer} name="answer" onChange={handleChange}>
                  <option value={""}>Select Answer</option>
                  <option value={"optionA"}>{props.item?.optionAName}</option>
                  <option value={"optionB"}>{props.item?.optionBName}</option>
                  {props.item?.optionC != "" && props.item?.optionC != undefined && <option value={"optionC"}>{props.item?.optionCName}</option>}
                  {props.item?.optionD != "" && props.item?.optionD != undefined && <option value={"optionD"}>{props.item?.optionDName}</option>}
                </select>
              </div>

              <Button
                onClick={(e) => {
                  handleResultData(item?._id);
                }}
                className={"ml-auto"}
                type="button"
                color="primary"
              >
                Result Declare{" "}
                {Helper.ternaryOperator(resultLoading,<i className="fa fa-spinner fa-pulse fa-fw ml-1"></i>,<i className="fa fa-arrow-circle-right fa-lg text-dark ml-2" aria-hidden="true"></i>)}
              </Button>
            </div>
          ) : (
            <div className="d-flex align-items-center justify-content-between">
              Answer : {item?.answer} ({item[item?.answer]})
            </div>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};

export default View;
