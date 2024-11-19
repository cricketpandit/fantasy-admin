import React, { useState, useEffect } from 'react';
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
import moment from "moment";
import { useHistory } from "react-router-dom";
import Pagination from "react-js-pagination";
import { Button, Card, CardBody, CardHeader, CardFooter, Col, Row, Table  } from 'reactstrap';
import _ from "lodash";
import "react-datepicker/dist/react-datepicker.css";
import Loaders from '../CommanPage/Loader'
import useSession from "react-session-hook";
import { useAlert } from "react-alert";

const ListInfluenceUsers = (props) => {
  const session = useSession();
  let history = useHistory();
  const alert = useAlert();
  const [users, setUsers] = useState([]);
  const [totalitems, setTotalItems] = useState('');
  const [activepage, setActivePage] = useState(1);
  const [visible, setVisibale] = useState(false);
  const [token] = useState(session.token);
  const [exportExcel, setExportExcel] = useState('');
  const [influencer_data, setInfluencerData] = useState({});


  const getData = async (page = activepage) => {
    setVisibale(true);
    setActivePage(page)
    let path;
    path = apiUrl.get_influence_users + '/' + `${props.match.params.id}`;
    const fr = await Helper.get(token, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {

        setUsers(res.results || []);
        setInfluencerData(res.couponData);

        setTotalItems(res.totalDocs.length);
        setVisibale(false)
        setExportExcel(res.excel_path);
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

  return (
    <div className="animated fadeIn loader-outer">
      <Loaders className="overlay-loader" visible={visible} />
      <Row>
        <Col>
          <Card>
            <CardHeader className="align-items-center d-flex">
              Influence Code Users
            </CardHeader>
            <CardBody>
              <div className="multipal-searching">
                <Row>
                  <Col md={3}>
                    <a href={exportExcel} download>
                      <button className="btn btn-primary mr-1 col-md-12" type="button"><i className="fa fa-file-excel-o" /> Export Excel</button>
                    </a>
                  </Col>
                </Row>
              </div>
              <div id="reportId" >
                <Table hover bordered responsive className="mt-3 text-center">
                  <thead>
                    <tr>
                      <th className="text-left">User ID</th>
                      <th className="text-left">User Name</th>
                      <th className="text-right">Email</th>
                      <th className="text-right">Influencer Code</th>
                      <th className="text-right">Bonus Amount</th>
                      <th className="text-center">Transaction Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td className="text-left">{item.rows._id}</td>
                          <td className="text-left">{item.rows.full_name}</td>
                          <td className="text-right">{item.rows.email}</td>
                          <td className="text-right">{item.rows.influencer_code}</td>
                          <td className="text-right">{item.rows.bonus_amount}</td>
                          <td className="text-center">{moment(item.rows.txn_date).format('LLL')}</td>
                        </tr>
                      )
                    })}
                    {_.isEmpty(users) && <tr><td colSpan="9"><div className="text-center">No Record Found</div></td></tr>}
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
            <CardFooter>
                <Button onClick={() => history.goBack()} className="dark_btn"><i className="fa fa-arrow-left" aria-hidden="true"></i> Back  </Button>
              </CardFooter>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ListInfluenceUsers;
