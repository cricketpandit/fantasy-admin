import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
import moment from "moment";
import Pagination from "react-js-pagination";
import { Card, CardBody, CardHeader, Col, Row, Table, Form, Input, FormGroup } from 'reactstrap';
import _ from "lodash";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loaders from '../CommanPage/Loader'
import useSession from "react-session-hook";
import Status from './Action/Status';
import Delete from './Action/Delete';
import { useAlert } from "react-alert";

const Banners = (props) => {
  const session = useSession();
  const alert = useAlert();
  const [users, setUsers] = useState([]);
  const [totalitems, setTotalItems] = useState('');
  const [activepage, setActivePage] = useState(1);
  const [visible, setVisibale] = useState(false);
  const [token] = useState(session.token);
  const [isserach, setIsserach] = useState(false);
  const [bannerPath, setBannerPath] = useState(false);
  const [query, setQuery] = useState({});
  const module = session.profile.user_type == "editor" ? session.profile.permissions.find((e) => e.manager == "Banners") : {}
  const { user_type } = session.profile;
  const pageData = async (page = activepage) => {
    setVisibale(true);
    const itemsPerPage = 10;

    setActivePage(page)
    query["page"] = page
    query["itemsPerPage"] = itemsPerPage
    let queryString = Helper.serialize(query);
    let path = apiUrl.get_promotional_banners + `?${queryString}`;
    getData(path)
  };

  const getData = async (path) => {
    const fr = await Helper.get(token,path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setUsers(res.results.docs || []);
        setTotalItems(res.results.totalDocs);
        setBannerPath(res.banner_path);
        setIsserach(false);
        setVisibale(false);
      } else {
        alert.error(res.msg);
        setIsserach(false); setVisibale(false);
      }
    } else {
      alert.error(res.error);
      setIsserach(false); setVisibale(false);
    }
  }

  const isEditor = user_type === "editor" && module.edit === 1;
  const isAdmin = user_type === "admin";
  const shouldRenderEditButton = isEditor || isAdmin;

  const editButton = (item)=> {
    if(shouldRenderEditButton)
    {
      return <Link to={{ pathname: `/edit-promotional-banner/${item.id}` }} className="btn-link">
      <button className="btn circle_btn btn-sm mr-1" type="button" title="Edits">
        <i className="fa fa-pencil" />
      </button>
    </Link>
    }  
  }
    
  const isEditorDeleteAllowed = user_type === "editor" && module.delete === 1;
  const shouldRenderDeleteComponent = isEditorDeleteAllowed || isAdmin;
  
  const deleteComponent = (item) =>{
    if(shouldRenderDeleteComponent){
      return <Delete item={item} refreshData={pageData} />
    }
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
              Promotional Banners
              <div className="ml-auto">
                <Link to="/add-promotional-banner" className="btn btn-primary">
                  <i className="fa fa-plus mr-1"></i>Add Promotional Banner
                </Link>
              </div>
            </CardHeader>
            <CardBody>
              
              <div id="reportId" >
                <Table hover bordered responsive className=" text-center">
                  <thead>
                    <tr>
                      <th className="text-align-left">Type</th>
                      <th className="text-align-center">Status</th>
                      <th className="text-align-center">Created At</th>
                      <th className="text-align-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td className="text-align-left">{item.media_type}</td>
                          <td className="text-align-center">
                            <Status item={item} refreshData={pageData} />
                          </td>
                          <td className="text-align-center">{moment(item.created_at).format('LLL')}</td>
                          <td className="text-align-center w-40">
                            {
                              _.isEmpty(props.match.params.id) ?
                                <div>                                  
                                  {deleteComponent(item)}
                                  {editButton(item)}
                                </div>
                                : null
                            }
                          </td>
                        </tr>
                      )
                    })}
                    {_.isEmpty(users) && <tr><td colSpan="10"><div className="text-center">No Record Found</div></td></tr>}
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

export default Banners;
