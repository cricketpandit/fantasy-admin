import React from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter,Table} from 'reactstrap';
import _ from "lodash";

const WinnersList = (props) => {
const {handleCloseModal, modal,winnersList}  = props

  return (
    <div className={"inline-btn"}>
      <Modal isOpen={modal} toggle={e => {handleCloseModal()}} className="custom-modal modal-lg">
        <ModalHeader toggle={e => {handleCloseModal()}}>View</ModalHeader>
        <ModalBody>
          <Table hover bordered responsive className="mt-3 text-center">
            <thead>
              <tr>
                <th>User name</th>
                <th>Points</th>
                <th>Rank</th>
                <th>Reward</th>
              </tr>
            </thead>
            <tbody>
              {winnersList.map((item, key) => {
                return (
                  <tr key={key}>
                    <td>{item.username}</td>
                    <td>{item.points}</td>
                    <td>{item.rank}</td>
                    <td>{item.reward}</td>                    
                  </tr>
                )
              })}
              {_.isEmpty(winnersList) && <tr><td colSpan="11"><div className="text-center">No Record Found</div></td></tr>}
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <button type="button" className="btn dark_btn" data-dismiss="modal" onClick={(e) => {handleCloseModal()}}>Close</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default WinnersList;
