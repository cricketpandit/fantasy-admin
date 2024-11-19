import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Table } from "reactstrap";

const ViewCricketContest = (props) => {
  const [modal, setModal] = useState(false);
  const [winning_amount] = useState(props.item.winning_amount);
  const [users_limit] = useState(props.item.users_limit);
  const [contest_type] = useState(props.item.contest_type);
  const [entry_fee] = useState(props.item.entry_fee);
  const [auto_create] = useState(props.item.auto_create === true ? "Yes" : "No");
  const [join_multiple_team] = useState(props.item.join_multiple_team === true ? "Yes" : "No");
  const [confirm_winning] = useState(props.item.confirm_winning === true ? "Yes" : "No");
  const [price_breakup] = useState(props.item.price_breakup);
  const [bonus] = useState(props.item.bonus);

  return (
    <div className={"inline-btn"}>
      <button
        className="btn circle_btn btn-sm mr-1 mt-1"
        type="button"
        title="View Details"
        onClick={(e) => {
          setModal(true);
        }}
      >
        <i className="fa fa-eye"></i>
      </button>
      <Modal
        isOpen={modal}
        toggle={(e) => {
          setModal(false);
        }}
        className="custom-modal modal-lg"
      >
        <ModalHeader
          toggle={(e) => {
            setModal(false);
          }}
        >
          Contest Detail
        </ModalHeader>
        <ModalBody>
          <Table hover bordered responsive className="mt-3 text-center">
            <tr>
              <td>Contest Name : </td>
              <td>{props.item.name}</td>
            </tr>
            <tr>
              <td>Winning Amount ($) : </td>
              <td>{winning_amount}</td>
            </tr>
            <tr>
              <td>Contest Size : </td>
              <td>{users_limit}</td>
            </tr>
            <tr>
              <td>Contest Type : </td>
              <td>{contest_type}</td>
            </tr>
            <tr>
              <td>Entry Fee ($) : </td>
              <td>{entry_fee}</td>
            </tr>
            <tr>
              <td>Auto Create : </td>
              <td>{auto_create}</td>
            </tr>
            <tr>
              <td>Join with multiple teams : </td>
              <td>{join_multiple_team}</td>
            </tr>
            <tr>
              <td>Confirmed winning : </td>
              <td>{confirm_winning}</td>
            </tr>
            <tr>
              <td>Bonus : </td>
              <td>{bonus}%</td>
            </tr>
          </Table>

          <Table responsive className="last-child-auto">
            <thead>
              <tr>
                <th>Name</th>
                <th>Start</th>
                <th>End</th>
                <th>{winning_amount > 0 ? "Percentage" : "Reward"}</th>
                {winning_amount > 0 && <th>Price</th>}
              </tr>
            </thead>
            <tbody>
              {price_breakup.map((cItem, key) => {
                return (
                  <tr key={key}>
                    <td>Rank {cItem.start_rank == cItem.end_rank ? cItem.start_rank : cItem.start_rank + " - " + cItem.end_rank}</td>
                    <td>{cItem.start_rank}</td>
                    <td>{cItem.end_rank}</td>
                    <td>{winning_amount > 0 ? cItem.each_percentage : cItem.reward}</td>
                    {winning_amount > 0 && <td>{cItem.each_price}</td>}
                    
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            className="btn dark_btn"
            data-dismiss="modal"
            onClick={(e) => {
              setModal(false);
            }}
          >
            Close
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ViewCricketContest;
