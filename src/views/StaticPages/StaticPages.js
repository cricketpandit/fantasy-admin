import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
import Swal from 'sweetalert2';
import moment from "moment";
import _ from "lodash";
import Pagination from "react-js-pagination";
import { Card, CardBody, CardHeader, Col, Row, Table, Form, Input, FormGroup } from 'reactstrap';
import "react-datepicker/dist/react-datepicker.css";
import Loaders from '../CommanPage/Loader';
import useSession from 'react-session-hook';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});
const StaticPages = (props) => {

  const session = useSession();
  const [superdata, setSuperdata] = useState([]);
  const [totalitems, setTotalItems] = useState('');
  const [activepage, setActivePage] = useState(1);
  const [startdate, setStartDate] = useState('');
  const [enddate, setEndDate] = useState('');
  const [serachstatus, setSerachStatus] = useState('');
  const [keywords, setKeyWords] = useState('');
  const [visible, setVisibale] = useState(false);
  const [token] = useState(session.token);
  const [isserach, setIsserach] = useState(false);
  const module = session.profile.user_type === "editor" ? session.profile.permissions.find((e) => e.manager === "Static Pages") : {}
  const { user_type } = session.profile;

  const getData = async (page = activepage) => {
    setVisibale(true);
setActivePage(page)
    const itemsPerPage = 10;
    let path = apiUrl.getStaticPages + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}`;
    const fr = await Helper.get(token,path);
    const res = await fr.response.json();
   
    if (fr.status === 200) {
      if (res.success) {
        setSuperdata(res.results.docs || []);
        setTotalItems(res.results.totalDocs);
        setVisibale(false)
      } else {
        Toast.fire({
          type: "error",
          title: res.msg,
        });
        setVisibale(false)
      }
    } else {
      Toast.fire({
        type: "error",
        title: res.error,
      });
      setVisibale(false)
    }

  };

  useEffect(() => {
    getData();
  }, []);

  const handleSearching = async () => {
    setIsserach(true);
    const itemsPerPage = 10;
    let  path = apiUrl.getStaticPages + '?page=' + `${activepage}` + '&itemsPerPage=' +  `${itemsPerPage}` + '&keyword=' + `${keywords}` + '&start_date=' + `${startdate === '' ? '' : moment(startdate).format('YYYY-MM-DD')}` + '&end_date=' + `${enddate === '' ? '' : moment(enddate).format('YYYY-MM-DD')}` + '&status=' + `${serachstatus}`;
    
    const fr = await Helper.get(token,path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setSuperdata(res.results.docs || []);
        setTotalItems(res.results.totalDocs);
        setIsserach(false);
      } else {
        Toast.fire({
          type: "error",
          title: res.msg,
        });
        setIsserach(false);
      }
    } else {
      Toast.fire({
        type: "error",
        title: res.error,
      });
      setIsserach(false);
    }

  };
  const onReset = (e) => {
    setStartDate('');
    setEndDate('');
    setKeyWords('');
    setSerachStatus('');
    getData();
  };

  return (
    <div className="animated fadeIn loader-outer">
      <Loaders className="overlay-loader" visible={visible} />
      <Row>
        <Col>
          <Card>
            <CardHeader>
              Static pages
            </CardHeader>
            <CardBody>
            <div className="multipal-searching">
                <Row>
                  <Col lg={9}>
                    <Form>
                      <Row>
                      <Col md={3} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <Input type="text" placeholder="Search" value={keywords} className="form-control"
                              onChange={(e) => { setKeyWords(e.target.value) }} />
                          </FormGroup>
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                  <Col xl={3} className="text-xl-right ">
                        <button className="btn btn-primary ml-1" type="button" onClick={handleSearching}><i className="fa fa-search" /> Search{isserach === true && <i className="fa fa-spinner fa-pulse fa-fw ml-1" />}</button>
                        <button className="btn dark_btn ml-1 " type="button" onClick={(e) => { onReset(); }}><i className="fa fa-undo" /> Reset</button>
                  </Col>
                </Row>
              </div>
              <div id="reportId" >
                <Table hover bordered responsive className="mt-3 text-center">
                  <thead>
                    <tr>
                      <th className="text-left">Title</th>
                      <th className="text-center">Updated</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {superdata.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td className="text-left">{item.title}</td>
                          <td className="text-center">{moment(item.updated_at).format('LL')}</td>
                          <td className="text-center w-40">

                          {((user_type === "editor" && module.edit == 1) || user_type=="admin")?                                  
                            <Link to={{ pathname: "/edit-static-pages", state: item }} title="Edit" className="btn circle_btn btn-sm mr-1 "><i className="fa fa-pencil"></i></Link>
                            :null}
                          </td>
                        </tr>
                      )
                    })}
                     {_.isEmpty(superdata) && <tr><td colSpan="4"><div className="text-center">No Record Found</div></td></tr>}
                  </tbody>
                </Table>
              </div>
             
              {superdata?.length!== 0 && <div className="show-pagination technician-page">
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
export default StaticPages;
