import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
import moment from "moment";
import Pagination from "react-js-pagination";
import { Card, CardBody, CardHeader, Col, Row, Table, Form, Input, FormGroup } from 'reactstrap';
import _ from "lodash";
import Loaders from '../CommanPage/Loader'
import useSession from "react-session-hook";
import { useAlert } from "react-alert";

const Logs = (props) => {
    const session = useSession();
    const alert = useAlert();
    const [users, setUsers] = useState([]);
    const [totalitems, setTotalItems] = useState('');
    const [activepage, setActivePage] = useState(1);
    const [serachstatus, setSerachStatus] = useState('');
    const [keywords, setKeyWords] = useState('');
    const [visible, setVisibale] = useState(false);
    const [token] = useState(session.token);
    const [isserach, setIsserach] = useState(false);
    const module = session.profile.user_type == "editor" ? session.profile.permissions.find((e) => e.manager == "Influencers") : {}
    const { user_type } = session.profile;

    const getData = async (page = activepage) => {
        setVisibale(true);
        setActivePage(page)
        const itemsPerPage = 10;
        let path;
        if (props.match.params.id) {
            path = apiUrl.get_logs + '/' + `${props.match.params.id}` + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}`;
        } else {
            path = apiUrl.get_logs + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}`;
        }
        const fr = await Helper.get(token, path);
        const res = await fr.response.json();
        if (fr.status === 200) {
            if (res.success) {
                setUsers(res.results.docs || []);
                setTotalItems(res.results.totalDocs);
                setVisibale(false)
            } else {
                alert.error(res.msg);
                setVisibale(false)
            }
        } else {
            alert.error(res.error);
            setVisibale(false)
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const buildApiUrl = () => {
        const itemsPerPage = 10;
        const baseApiUrl = apiUrl.get_logs;
        const commonParams = `?page=${activepage}&itemsPerPage=${itemsPerPage}&keyword=${keywords}&status=${serachstatus}`;
        return `${baseApiUrl}/${commonParams}`
    };

    const handleSearching = async () => {
        try {
            setActivePage(activepage || 1);
            setIsserach(true);

            const path = buildApiUrl();

            const fr = await Helper.get(token, path);
            const res = await fr.response.json();

            if (fr.status === 200) {
                if (res.success) {
                    setUsers(res.results.docs || []);
                    setTotalItems(res.results.totalDocs);
                } else {
                    alert.error(res.msg);
                }
            } else {
                alert.error(res.error);
            }

            setIsserach(false);
        } catch (error) {
            alert.error(error.message);
            setIsserach(false);
        }
    };

    return (
        <div className="animated fadeIn loader-outer">
            <Loaders className="overlay-loader" visible={visible} />
            <Row>
                <Col>
                    <Card>
                        <CardHeader className="align-items-center d-flex">
                            Cron Logs
                        </CardHeader>
                        <CardBody>
                            
                            <div id="reportId" >
                                <Table hover bordered responsive className="mt-3 text-center">
                                    <thead>
                                        <tr>
                                            <th className="text-left">Match Id</th>
                                            <th className="text-left">Match Name</th>
                                            <th className="text-right">Match Status</th>
                                            <th className="text-right">Cron Name</th>
                                            <th className="text-center">Status</th>
                                            <th className="text-center">Created At</th>
                                            <th className="text-center">Updated At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((item, key) => {
                                            return (
                                                <tr key={key}>
                                                    <td className="text-left">{item.matchId}</td>
                                                    <td className="text-left">{item.match_name}</td>
                                                    <td className="text-right">{item.match_status}</td>
                                                    <td className="text-right">{item.cronName}</td>
                                                    <td className="text-right">{item.status}</td>
                                                    <td className="text-center">{moment(item?.created_at).format('LLL')}</td>
                                                    <td className="text-center">{moment(item?.updated_at).format('LLL')}</td>
                                                </tr>
                                            )
                                        })}
                                        {_.isEmpty(users) && <tr><td colSpan="14"><div className="text-center">No Record Found</div></td></tr>}
                                    </tbody>
                                </Table>
                            </div>
                            {!_.isEmpty(users) && <div className="show-pagination technician-page">
                                <Pagination
                                    activeClass={""}
                                    activeLinkClass={"page-link active"}
                                    itemClass={"page-item"}
                                    linkClass={"page-link"}
                                    activePage={activepage}
                                    itemsCountPerPage={10}
                                    totalItemsCount={Number(totalitems)}
                                    pageRangeDisplayed={4}
                                    prevPageText="Previous"
                                    nextPageText="Next"
                                    firstPageText="<"
                                    lastPageText=">"
                                    onChange={getData}
                                />
                            </div>}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Logs;
