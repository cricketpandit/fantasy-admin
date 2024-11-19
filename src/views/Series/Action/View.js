import React, { useState, useEffect } from 'react';
import Helper from '../../../constants/helper';
import apiUrl from '../../../constants/apiPath';
import { Modal, ModalHeader, ModalBody, ModalFooter,Table} from 'reactstrap';
import {useAlert} from 'react-alert';
import useSession from 'react-session-hook';
import _ from "lodash";
import moment from "moment-timezone";
import MatchStatus from './MatchStatus';
let tz_asia = 'Asia/Kolkata';

const View = (props) => {
const {item, getData, pagePath, handleCloseModal, modal}  = props
  const session = useSession();
  const alert = useAlert();
  const [matches, setMatches] = useState([]);
  const [token] = useState(session.token);

  const getSeriesMatches = async () => {
    let path;
    path = apiUrl.get_series_all_matches+'/'+item?.id_api;
   
    const fr = await Helper.get(token,path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setMatches(res.results.docs || []);
      } else {
        alert.error(res.msg);
      }
    } else {
      alert.error(res.error);
    }

  };

  useEffect(() => {
    if(item?.id_api){
    getSeriesMatches();
    }
  }, [props]);

  return (
    <div className={"inline-btn"}>
      <Modal isOpen={modal} toggle={e => {handleCloseModal()}} className="custom-modal modal-lg">
        <ModalHeader toggle={e => {handleCloseModal()}}>View</ModalHeader>
        <ModalBody>
          <Table hover bordered responsive className="mt-3 text-center">
            <thead>
              <tr>
                <th>Match</th>
                <th>Date</th>
                <th>Time</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((items, key) => {
                return (
                  <tr key={key}>
                    <td>{items.localteam} Vs {items.visitorteam}</td>
                    <td>{moment(items.match_date).tz(tz_asia).format('YYYY-MM-DD')}</td>
                    <td>{moment(items.match_date).tz(tz_asia).format('hh:mm a')}</td>
                    <td>{items.type}</td>
                    <td>
                      {
                        <MatchStatus getData={getData} pagePath={pagePath} item={items} refreshStatusData={getSeriesMatches} />
                      }
                    </td>
                  </tr>
                )
              })}
              {_.isEmpty(matches) && <tr><td colSpan="11"><div className="text-center">No Record Found</div></td></tr>}
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

export default View;
