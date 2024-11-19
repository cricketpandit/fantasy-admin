
import React, { useState, useEffect } from 'react';

import Helper from '../../constants/helper';
import { useHistory } from "react-router-dom";
import apiUrl from '../../constants/apiPath';
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter,Table } from 'reactstrap';
import _ from 'lodash';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
import WinnersList from "./WinnersList";

const WinningUsersList = (props) => {
    const session = useSession();
    let history = useHistory();
    const alert = useAlert();
    const [token] = useState(session.token);
    const [modal, setModal] = useState(false);
    const [matchData, setMatchData] = useState({});
    const [winnersList, setWinnersList] = useState([]);

    const getData = async (matchId) => {
        let path = apiUrl.get_match_detail_by_match_id + '/' + matchId;
        const fr = await Helper.get(token,path);
        const res = await fr.response.json();
        if (fr.status === 200) {
            if (res.success) {
                setMatchData(res.results[0]);
            } else {
                console.log(res.msg);
            }
        } else {
            console.log(res.msg);
        }
    };

    const handleWinnersData = (data) => {
        getWinnersList(data)
        setModal(true)
    }

    const getWinnersList = async (data) => {
        let path;
        path = apiUrl.get_contest_details_for_admin;    
        let postJson = {
          match_id: props.match.params.id,
          contest_id: data._id,     
      };
     
        const fr = await Helper.post(token,postJson,path);
        const res = await fr.response.json();
        if (fr.status === 200) {
          if (res.success) {
            setWinnersList(res.results.joined_teams || []);
          } else {
            alert.error(res.msg);
          }
        } else {
          alert.error(res.error);
        }
    
      };
    const handleCloseModal = () => {
    setModal(false)
    }
    const handleBack = () => {
        history.push('/cricket/schedule-contest',  history?.location?.state );
    }

    useEffect(() => {
        getData(props.match.params.id);
    }, []);
 

    return (
        <React.Fragment>
            <Card>
                <CardHeader>
                    <CardTitle className="text-info"><h4>Contest List For Match</h4></CardTitle>
                </CardHeader>
                <CardBody>
                    <div id="reportId" >
                        <Table hover bordered responsive className="mt-3 text-center">
                            <tbody>
                            <tr>
                                <th>Match Id : {`${matchData.match_id}`}</th>
                                <th colspan="3">Match : {`${matchData.localteam} Vs ${matchData.visitorteam}`}</th>
                                <th colspan="2">Date : {`${new Date(matchData.timestamp_start*1000).toDateString()}`}</th>
                            </tr>
                            <tr>
                                <th>Name</th>
                                <th>Winning Amount</th>
                                <th>Contest Size</th>
                                <th>Entry Fee</th>
                                <th>Winners List</th>
                            </tr>
                            {matchData?.contestData?.map((val, key) => {
                                    return (                                                
                                        <tr key={key}>
                                            <td>{val.name}</td>
                                            <td>{val.winning_amount}</td>
                                            <td>{val.users_limit}</td>
                                            <td>{val.entry_fee}</td>
                                            <td>
                                                <button className="btn circle_btn btn-sm mr-1" type="button" title="Show Winners" onClick={() => handleWinnersData(val)}>Show Winners</button>
                                            </td>
                                        </tr>
                                    )
                                })}
                                {_.isEmpty(matchData?.contestData) && <tr><td colSpan="5"><div className="text-center">No Record Found</div></td></tr>}
                            </tbody>
                        </Table>
                    </div>
                <CardFooter>
                    <Button onClick={() => handleBack()} className="dark_btn"><i className="fa fa-arrow-left" aria-hidden="true"></i> Back  </Button>
                </CardFooter>
                </CardBody>
            </Card>
            <WinnersList winnersList={winnersList} modal={modal} handleCloseModal={handleCloseModal} />
        </React.Fragment >
    );
}

export default WinningUsersList;
