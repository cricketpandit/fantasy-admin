import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
import moment from "moment";
import Pagination from "react-js-pagination";
import { Card, CardBody, Col, Row, Table} from 'reactstrap';
import _ from "lodash";
import Loaders from '../CommanPage/Loader'
import useSession from "react-session-hook";
import WebStatus from './Action/WebStatus';
import { useAlert } from "react-alert";

const WebBanners = (props) => {
  const session = useSession();
  const alert = useAlert();
  const [banners, setBanners] = useState([]);
  const [totalitems, setTotalItems] = useState('');
  const [activepage, setActivePage] = useState(1);
  const [visible, setVisibale] = useState(false);
  const [token] = useState(session.token);
  const [bannerPath, setBannerPath] = useState(false);

  const getData = async (page = activepage) => {
    setVisibale(true);
setActivePage(page)
    const itemsPerPage = 10;
    let path;
    path = apiUrl.get_web_banners + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}`;

    const fr = await Helper.get(token,path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setBanners(res.results.docs || []);
        setTotalItems(res.results.totalDocs);
        setBannerPath(res.banner_path);
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


  return (
    <div className="animated fadeIn loader-outer">
      <Loaders className="overlay-loader" visible={visible} />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div id="reportId" >
                <Table hover bordered responsive className="mt-3 text-center">
                  <thead>
                    <tr>
                      <th className="text-align-left">Title</th>
                      <th className="text-align-right">Sequence</th>
                      <th className="text-align-center">Banner</th>
                      <th className="text-align-center">Status</th>
                      <th className="text-align-center">Created At</th>
                      <th className="text-align-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {banners.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td className="text-align-left">{item.title}</td>
                          <td className="text-align-right">{item.sequence}</td>
                          <td className="text-align-center"><img src={bannerPath + item.image} height="100" width="200" /></td>
                          <td className="text-align-center">
                            <WebStatus item={item} refreshData={getData} />
                          </td>
                          <td className="text-align-center">{moment(item.created_at).format('LLL')}</td>
                          <td className="text-align-center w-40">
                            {
                              _.isEmpty(props.match.params.id) ?
                                <div>
                                  <Link to={{ pathname: `/edit-web-banner/${item.id}` }} className="btn-link">
                                    <button className="btn circle_btn btn-sm mr-1" type="button" title="Status">
                                      <i className="fa fa-pencil" />
                                    </button>
                                  </Link>
                                </div>
                                : null
                            }
                          </td>
                        </tr>
                      )
                    })}
                    {_.isEmpty(banners) && <tr><td colSpan="6"><div className="text-center">No Record Found</div></td></tr>}
                  </tbody>
                </Table>
              </div>
              {!_.isEmpty(banners) && <div className="show-pagination technician-page">
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

export default WebBanners;