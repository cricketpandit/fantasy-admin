
import React, { useState, useEffect, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import "react-datepicker/dist/react-datepicker.css";

import Helper from '../../constants/helper';
import { useHistory } from "react-router-dom";
import apiUrl from '../../constants/apiPath';
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, Table } from 'reactstrap';

import _ from 'lodash';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
import Swal from "sweetalert2";

const ScheduleAddContest = (props) => {
    const session = useSession();
    let history = useHistory();
    const alert = useAlert();
    const { handleSubmit } = useForm();
    const [token] = useState(session.token);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [contestIds, setContestIds] = useState([]);
    const [joinedContestIds, setJoinedContestIds] = useState([]);
    const [saveIds, setSaveIds] = useState({})
    const [isChecked, setIsChecked] = useState({})
    const onSubmit = async data => {
        let SwalConfig = Helper.SwalConfig("You want to add contest for this match");
        const result = await Swal.fire(SwalConfig);
        let filteredData = contestIds.filter(value => !joinedContestIds.includes(value))
        if (result.value) {
            if (filteredData.length == 0) {
                alert.error('Please select atleast one contest.');
                return
            }
            setLoading(true);
            let postJson = {
                id: props.match.params.id,
                contestIds: filteredData,
                user_id: session.profile._id
            };
            if (!contestIds.length) {
                setLoading(false);
                alert.error('Please select atleast one contest.');
                return;
            }
            let path = apiUrl.update_match_schedule_contest;
            const fr = await Helper.put(token, postJson, path);
            const res = await fr.response.json();
            if (fr.status === 200) {
                if (res.success) {
                    setLoading(false);
                    props.history.push('/cricket/schedule-contest');
                    alert.success(res.msg);
                } else {
                    alert.error(res.msg);
                    setLoading(false);
                }
            } else {
                alert.error(res.error);
                setLoading(false);
            }
        }
    };

    const getCatData = async (matchId) => {
        let path = apiUrl.get_contest_Bycategory + '/' + matchId;
        const fr = await Helper.get(token, path);
        const res = await fr.response.json();
        if (fr.status === 200) {
            if (res.success) {
                setUsers(res.results);
                let dataIds = {}
                let forAllCheck = {}
                res.results?.forEach(value => {
                    dataIds[value?.cat_data?.title] = []
                    forAllCheck[value?.cat_data?.title] = false
                    value?.contestData?.forEach(item => {
                        dataIds[value?.cat_data?.title]?.push(item?._id)
                    })
                })
                setSaveIds(dataIds)
                setIsChecked(forAllCheck)
            } else {
                console.log(res.msg);
            }
        } else {
            console.log(res.msg);
        }
    };

    const getData = async (matchId) => {
        let path = apiUrl.get_match_byId + '/' + matchId;
        const fr = await Helper.get(token, path);
        const res = await fr.response.json();
        if (fr.status === 200) {
            if (res.success) {
                let scheduledContestIds = res.results.joined_contest.map(val => val.contest_id)
                getCatData(res.results.match_id);
                setContestIds(scheduledContestIds);
                setJoinedContestIds(scheduledContestIds);
            } else {
                console.log(res.msg);
            }
        } else {
            console.log(res.msg);
        }
    };

    const handleCheck = (e, title) => {
        let checkStatus = e.target.checked;
        let checkVal = e.target.value;
        if (checkStatus) {
            if (checkVal === "All") {
                setIsChecked(prev => {
                    return { ...prev, [title]: true }
                })
                let allData = [...new Set([...saveIds[title], ...contestIds])]
                setContestIds(allData)
            } else {
                setContestIds(oldArray => [...oldArray, checkVal]);
            }
        } else {
            if (checkVal === "All") {
                setContestIds([...contestIds?.filter(value => !saveIds[title]?.includes(value)), ...joinedContestIds?.filter(value => saveIds[title]?.includes(value))])
            } else {
                setContestIds(contestIds.filter(prev => prev !== checkVal));
            }
            setIsChecked(prev => {
                return { ...prev, [title]: false }
            })
        }
    }

    const loadingIcon = loading === true ? <i className="fa fa-spinner fa-pulse fa-fw ml-1"></i> : <i className="fa fa-arrow-circle-right fa-lg" aria-hidden="true"></i>;
    useEffect(() => {
        getData(props.match.params.id);
    }, []);
    return (
        <React.Fragment>
            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-info"><h4>Add contest for match</h4></CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div id="reportId" >
                            <Table hover bordered responsive className="mt-3 text-center">
                                <tbody>
                                    {users.map((item, key) => {
                                        if (item.contestData.length) {
                                            return (
                                                <Fragment key={key}>
                                                    <tr key={key} style={{ "background": "rgba(0, 0, 0, 0.075)" }}>
                                                        <td colSpan="6" className="text-center border-left-0" style={{ "verticalAlign": "middle" }}><h3>{item.cat_data.title}</h3></td>
                                                    </tr>
                                                    <tr key={key + 1}>
                                                        <th className="text-center"> <input type={'checkbox'} checked={isChecked[item.cat_data.title]} name={'contest_id[]'} value={"All"} style={{ marginRight: "10px" }} onChange={(e) => handleCheck(e, item.cat_data.title)} />All</th>
                                                        <th>Name</th>
                                                        <th>Winning Amount</th>
                                                        <th>Contest Size</th>
                                                        <th>Entry Fee</th>
                                                    </tr>
                                                    {item.contestData.map((val, k) => {
                                                        let checkedStatus = (contestIds.indexOf(val._id) !== -1) ? true : false;
                                                        let isJoined = (joinedContestIds.indexOf(val._id) !== -1) ? true : false;
                                                        let disabled = (isJoined) ? true : false;
                                                        return (
                                                            <tr key={k}>
                                                                <td className="text-center">
                                                                    <input type={'checkbox'} checked={checkedStatus} disabled={disabled} name={'contest_id[]'} value={val._id} onChange={(e) => handleCheck(e, item.cat_data.title)} />
                                                                </td>
                                                                <td>{val.name}</td>
                                                                <td>{val.winning_amount}</td>
                                                                <td>{val.users_limit}</td>
                                                                <td>{val.entry_fee}</td>
                                                            </tr>);
                                                    })
                                                    }
                                                </Fragment>
                                            )
                                        }
                                    })}
                                    {_.isEmpty(users) && <tr><td colSpan="11"><div className="text-center">No Record Found</div></td></tr>}
                                </tbody>
                            </Table>
                        </div>
                    </CardBody>



                    {!_.isEmpty(users) ? (
                        <CardFooter>
                            <Button onClick={() => history.goBack()} className="dark_btn"><i className="fa fa-arrow-left" aria-hidden="true"></i> Back  </Button>
                            <Button className={'ml-2'} type="submit" color="primary">Submit {loadingIcon}</Button>

                        </CardFooter>
                    ) : null}

                </Card>
            </form>
        </React.Fragment >
    );
}

export default ScheduleAddContest;
