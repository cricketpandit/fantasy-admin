import React, { useState, useEffect } from 'react';
import Pagination from "react-js-pagination";
import { Card, CardBody, CardHeader, Col, Row, Table, Form, FormGroup, Modal, ModalHeader, ModalBody, Label, ModalFooter } from 'reactstrap';
import _ from "lodash";
import "react-datepicker/dist/react-datepicker.css";
import Loaders from '../CommanPage/Loader'
import { useAlert } from "react-alert";
import useSession from "react-session-hook";
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';

const InfluencerManagement = () => {

  const session = useSession();
  const alert = useAlert();
  const [influencerCode, setInfluencerCode] = useState('');
  const [list, setList] = useState([]);
  const [visible, setVisibale] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [token] = useState(session.token);
  const [query] = useState({});
  const [totalitems, setTotalItems] = useState('');
  const [activepage, setActivePage] = useState(1);

  const handleCloseModal = () => {
    setInfluencerCode('')
    setIsModalOpen(false)
  }

  const handleAddInfluencerCode = async () => {
    if (influencerCode !== '') {
      let path = apiUrl.addInfluencerCode + `?code=${influencerCode}`;
      const fr = await Helper.get(token,path);
      const res = await fr.response.json();
      if (fr.status === 200) {
        if (res.success) {
          setVisibale(false);
          handleCloseModal()
          getList(apiUrl.InfluencerCodeList + '?page=1&itemsPerPage=10')
        } else {
          alert.error(res.msg);
          setVisibale(false)
        }
      } else {
        alert.error(res.error);
        setVisibale(false)
      }
    } else {
      alert.error('influencer code is required');
    }
  }

  const getList = async (path) => {
    setVisibale(true);
    const fr = await Helper.get(token,path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setList(res.results.docs || []);
        setTotalItems(res.results.totalDocs);

        setVisibale(false);
      } else {
        alert.error(res.msg);
        setVisibale(false)
      }
    } else {
      alert.error(res.error);
      setVisibale(false)
    }
  }

  const getData = async (path) => {
    const fr = await Helper.get(token,path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setList(res.results.docs || []);
        setTotalItems(res.results.totalDocs);
        setVisibale(false);
      } else {
        alert.error(res.msg);
        setVisibale(false);
      }
    } else {
      alert.error(res.error);
      setVisibale(false);
    }
  }

  const handleDeleteInfluencerCode = async(item) => {
    const path = apiUrl.deleteInfluencerCode +`?id=${item?._id}`;
    setVisibale(true);
    const fr = await Helper.get(token,path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setVisibale(false);
        getList(apiUrl.InfluencerCodeList + '?page=1&itemsPerPage=10')
      } else {
        alert.error(res.msg);
        setVisibale(false)
      }
    } else {
      alert.error(res.error);
      setVisibale(false)
    }
  }

  const pageData = async (page = activepage) => {
    setVisibale(true);
    const itemsPerPage = 10;
    let path;
    setActivePage(page)
    query["page"] = page
    query["itemsPerPage"] = itemsPerPage
    let queryString = Helper.serialize(query);
    path = apiUrl.InfluencerCodeList + `?${queryString}`;
    getData(path)
  };

  useEffect(() => {
    pageData()
  }, [])

  const handleInfluencer=(e)=>{
    const wordPattern = /^[a-zA-Z]+$/
    if(!wordPattern.test(e.target.value.trim())){
      setInfluencerCode('')
    } else {
      setInfluencerCode(e.target.value.trim())
    }
  }

  return (
    <div className="animated fadeIn loader-outer">
      <Loaders className="overlay-loader" visible={visible} />
      <Row>
        <Col>
          <Card>
            <CardHeader className="align-items-center d-flex">
            influencers List

            </CardHeader>
            <CardBody>
              <div className="multipal-searching">
                <Row className='contest-searching'>
                  <Col lg={12}>
                    <Form>
                      <Row>
                        <Col md={2} sm={6} className=" ">
                          <button className="btn btn-primary ml-1" type="button" onClick={() => setIsModalOpen(true)}> <i className="fa fa-plus mr-1"></i>Add Influencer Code</button>
                        </Col>
                      </Row>
                    </Form>
                  </Col>

                </Row>
              </div>
              <div id="reportId" >
                <Table hover bordered responsive className="mt-3 text-center">
                  <thead>
                    <tr>
                      <th className="text-center">S. No.</th>
                      <th className="text-center">Code</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((item, key) => {
                      return (
                        <tr key={Math.floor((Math.random() * 10000000) + 1)}>
                          <td className="text-left">{key + 1}</td>
                          <td className="text-left">{item?.code}</td>

                          <td className="text-center">
                            <div>
                              <a className="btn-link" onClick={() => handleDeleteInfluencerCode(item)}>
                                <button className="btn circle_btn btn-sm mr-1" type="button" title="Edit">
                                  <i className="fa fa-trash" />
                                </button>
                              </a>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </div>
              {!_.isEmpty(list) && <div className="show-pagination technician-page">
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

      <Modal isOpen={isModalOpen} toggle={handleCloseModal} className={"custom-modal modal-lg"}>
        <ModalHeader toggle={handleCloseModal}>Add Influencer Code</ModalHeader>
        <ModalBody>
          <Row>
            <Col md={12}>
              <FormGroup>
                <Label md={12}><strong>Code</strong></Label>
                <input type="text" placeholder="Enter influencer code" maxLength={30} value={influencerCode} className="form-control" name="influencerCode" onChange={(e) => handleInfluencer(e)} />
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <button type="button" className="btn dark_btn" data-dismiss="modal" onClick={handleCloseModal}>Close</button>
          <button type="submit" className="btn dark_btn" data-dismiss="modal" onClick={() => handleAddInfluencerCode()}>Add</button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default InfluencerManagement