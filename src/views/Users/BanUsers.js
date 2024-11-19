import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
import Pagination from "react-js-pagination";
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import _ from "lodash";
import "react-datepicker/dist/react-datepicker.css";
import Loaders from '../CommanPage/Loader';
import useSession from "react-session-hook";
import { useAlert } from "react-alert";
import Switch from "react-switch";

const BanUsers = (props) => {
  const session = useSession();
  const alert = useAlert();
  const [users, setUsers] = useState([]);
  const [totalitems, setTotalItems] = useState('');
  const [activepage, setActivePage] = useState(1);
  const [keywords] = useState('');
  const [visible, setVisibale] = useState(false);
  const [token] = useState(session.token);
  const [query] = useState({});
  
  const pageData = async (page = activepage) => {
    setVisibale(true);
    const itemsPerPage = 10;
    let path;
    setActivePage(page)
    query["page"] = page
    query["itemsPerPage"] = itemsPerPage
    query["keyword"] = keywords

    let queryString = Helper.serialize(query);
    path = apiUrl.getReportList + `?${queryString}`;
    getData(path)
  };

  const getData = async (path) => {
    const fr = await Helper.get(token,path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setVisibale(false);
        setUsers(res.results.docs || []);
        setTotalItems(res.results.totalDocs);
      } else {
        alert.error(res.msg);
        setVisibale(false);
      }
    } else {
      alert.error(res.error);
      setVisibale(false);
    }
  }

  const toggleHandleChange = async (event, item) => {
    setVisibale(true);
    let postJson = {
      user_id: item._id,
      chatBanStatus: event,
    };
    let path = apiUrl.updateChatStatus;
    const fr = await Helper.post(token,postJson, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (!res.success) {
        alert.error(res.msg);
      }
    } else {
      alert.error(res.error);
    }
    path = apiUrl.getReportList + `?page=${activepage}&itemsPerPage=10`;
    getData(path)
  }


  useEffect(() => {
    pageData();
  }, []);

  return (
    <div className="animated fadeIn loader-outer">
      <Loaders className="overlay-loader" visible={visible} />
      <Row>
        <Col>
          <Card>
            <CardHeader className="align-items-center d-flex">
              Ban/Report Users
            </CardHeader>
            <CardBody>
              <div id="reportId" className='table-responisve-custom'>
                <Table hover bordered responsive className="mt-3 text-center">
                  <thead>
                    <tr>
                      <th className="text-align-center">S.No.</th>
                      <th className="text-align-center">Report Username</th>
                      <th className="text-align-center">Number Of Report</th>
                      <th className="text-align-center">Ban Status</th>
                      <th className="text-align-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>

                    {users?.length > 0 && users.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td className="text-align-center">{key + 1}</td>
                          <td className="text-align-center">{item?.reportedUserName}</td>
                          <td className="text-align-center">{item?.totalDocs}</td>
                          <td className="text-align-center">
                            <Switch

                              onChange={(e) => { toggleHandleChange(e, item) }}
                              checked={item?.banStatus}
                            />
                          </td>
                          <td className="text-align-center w-40 w-260">
                            {
                              _.isEmpty(props.match.params.id) ?
                                <div>

                                  <Link to={{ pathname: `/reporting-userList/${item?.reportedUserId}` }} className="btn-link">
                                    <button className="btn circle_btn btn-sm mr-1" type="button" title="Reported user list">
                                      <i className="fa fa-eye" />
                                    </button>
                                  </Link>

                                </div>
                                : null
                            }
                          </td>
                        </tr>
                      )
                    })}
                    {_.isEmpty(users) && <tr><td colSpan="13"><div className="text-center">No Record Found</div></td></tr>}
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
                  onChange={pageData}
                />
              </div>}
            </CardBody>
          </Card>
        </Col>
      </Row>

    </div>
  );
};

export default BanUsers;
