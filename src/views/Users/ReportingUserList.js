import React, { useState, useEffect } from 'react';
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
import Pagination from "react-js-pagination";
import { Button,Card, CardBody, CardHeader,CardFooter, Col, Row, Table } from 'reactstrap';
import _ from "lodash";
import moment from "moment";
import { useHistory } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import Loaders from '../CommanPage/Loader';
import useSession from "react-session-hook";
import { useAlert } from "react-alert";

const ReportingUserList = (props) => {
  const session = useSession();
  let history = useHistory();
  const alert = useAlert();
  const [users, setUsers] = useState([]);
  const [totalitems, setTotalItems] = useState('');
  const [activepage, setActivePage] = useState(1);
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
    let queryString = Helper.serialize(query);
    path = apiUrl.getReportinguserList + `?${queryString}&id=${props.match.params.id}`;
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

 


  useEffect(() => {
    pageData();
  },[]);

  return (
    <div className="animated fadeIn loader-outer">
      <Loaders className="overlay-loader" visible={visible} />
      <Row>
        <Col>
          <Card>
            <CardHeader className="align-items-center d-flex">
             Reporting User List
            </CardHeader>
            <CardBody>
           
              <div id="reportId" className='table-responisve-custom'>
                <Table hover bordered responsive className="mt-3 text-center">
                  <thead>
                    <tr>
                      <th className="text-align-center">S.No.</th>
                      <th className="text-align-center">Reporting User</th>
                      <th className="text-align-center">Reason</th>
                      <th className="text-align-center">Reported Date</th>
                    </tr>
                  </thead>
                  <tbody>

                    {users?.length > 0 && users.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td className="text-align-center">{key + 1}</td>
                          <td className="text-align-center">{item?.reportingUserName}</td>
                          <td className="text-align-center">{item?.reason}</td>
                          <td className="text-align-center">{item.createdAt ? moment(item.createdAt).format('LLL') : moment(item.created_at).format('LLL')}</td>
                       
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
            <CardFooter>
                <Button onClick={() => history.goBack()} className="dark_btn"><i className="fa fa-arrow-left" aria-hidden="true"></i> Back  </Button>                
            </CardFooter>
          </Card>
        </Col>
      </Row>

    </div>
  );
};

export default ReportingUserList;
