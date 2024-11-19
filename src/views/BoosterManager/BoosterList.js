import React, { useState, useEffect } from "react";
import { ErrorMessage, useForm } from "react-hook-form";
import Pagination from "react-js-pagination";
import { Card, CardHeader, Col, Row, Table, FormGroup, Modal, ModalHeader, ModalBody, Label, ModalFooter } from "reactstrap";
import _ from "lodash";
import "react-datepicker/dist/react-datepicker.css";
import Loaders from "../CommanPage/Loader";
import { useAlert } from "react-alert";
import useSession from "react-session-hook";
import Helper from "../../constants/helper";
import apiUrl from "../../constants/apiPath";
import moment from "moment";
import axios from "axios";

const BoosterList = () => {
  const session = useSession();
  const alert = useAlert();
  const { handleSubmit, errors } = useForm();
  const [keywords] = useState("");
  const [visible, setVisibale] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [token] = useState(session.token);
  const [query] = useState({});
  const [totalitems, setTotalItems] = useState("");
  const [activepage, setActivePage] = useState(1);
  const [boosterData, setBoosterData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [boostersList, setBoostersList] = useState([]);
  const [gameType, setGameType] = useState([]);
  const [addGameType, setAddGameType] = useState([]);
  const [price, setBoosterPrice] = useState("");
  const [description, setBoosterDescription] = useState("");
  const [multiplyBy, setMultiplyKey] = useState("");
  const [preview, setBoosterImagePreview] = useState("");
  const [booster_image, setBoosterImage] = useState("");
  const [icon_preview, setBoosterImageIconPreview] = useState("");
  const [booster_icon_image, setBoosterIconImage] = useState("");
  const [parentCategoryId] = useState("");
  const [parentCategoryName] = useState("");
  const [subCategoryName] = useState("");
  const [boosterSubCategoryId] = useState("");
  const [boostername, setBoosterName] = useState("");
  const [imagePresignedKey, setImagePresignedKey] = useState("");
  const [imagePresignedUrl, setImagePresignedUrl] = useState("");
  const [iconPresignedKey, setIconPresignedKey] = useState("");
  const [iconPresignedUrl, setIconPresignedUrl] = useState("");

  const onSubmit = async (data) => {
    setVisibale(true);
    let isImageUploaded = false;
    let isIconUploaded = false;
    const imageReader = new FileReader();
    if (booster_image) {
      imageReader.readAsArrayBuffer(booster_image);
    }
    imageReader.onloadend = async () => {
      const binaryData = imageReader.result;
      const resp = await axios.put(imagePresignedUrl, binaryData, {
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });
      if (resp?.status === 200) {
        isImageUploaded = true;
      }
    };
    const iconReader = new FileReader();
    if (booster_icon_image) {
      iconReader.readAsArrayBuffer(booster_icon_image);
    }
    iconReader.onloadend = async () => {
      const binaryIconData = iconReader.result;
      const respJersey = await axios.put(iconPresignedUrl, binaryIconData, {
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });
      if (respJersey?.status === 200) {
        isIconUploaded = true;
      }
    };
    if ((isImageUploaded || preview) && (isIconUploaded || icon_preview)) {
      isImageUploaded = false;
      isIconUploaded = false;

      let postJson;
      if (isEdit) {
        postJson = {
          id: boosterData._id,
          title: boostername,
          description: description,
          price: price,
          multiplyBy: multiplyBy,
          booster_icon_image: iconPresignedKey,
          booster_image: imagePresignedKey,
        };
      } else {
        postJson = {
          title: boostername,
          description: description,
          price: price,
          gameType: addGameType,
          categoryId: parentCategoryId,
          subCategoryId: boosterSubCategoryId,
          categoryName: parentCategoryName,
          subCategoryName: subCategoryName,
        };
      }
      // return;
      let path;
      if (isEdit) {
        path = apiUrl.updateBooster;
      } else {
        path = apiUrl.addBooster;
      }
      const fr = await Helper.post(token, postJson, path);
      const res = await fr.response.json();
      if (fr.status === 200) {
        if (res.success) {
          handleCloseModal();
          handleSearching();
          setVisibale(false);
          setIsEdit(false);
        } else {
          alert.error(res.msg);
          setVisibale(false);
        }
      } else {
        alert.error(res.error);
        setVisibale(false);
      }
    }
  };

  const handleBoosterName = (e) => {
    if (e.target.value.length <= e.target.maxLength) {
      setBoosterName(e.target.value);
    } else {
      return false;
    }
  };
  const handleBoosterPrice = (e) => {
    if (e.target.value.length <= e.target.maxLength) {
      setBoosterPrice(e.target.value);
    } else {
      return false;
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEdit(false);
    setBoosterName("");
    setBoosterPrice("");
    setBoosterDescription("");
    setMultiplyKey("");
    setBoosterImagePreview("");
    setBoosterImageIconPreview("");
    setBoosterImage("");
    setBoosterIconImage("");
    setAddGameType([]);
    setGameType([]);
  };

  const handleAddBooster = () => {
    setIsModalOpen(true);
  };
  const handleDescription = (e) => {
    if (e.target.value.length <= e.target.maxLength) {
      setBoosterDescription(e.target.value);
    } else {
      return false;
    }
  };
  const handleMultiplyKey = (e) => {
    if (e.target.value.length <= e.target.maxLength) {
      setMultiplyKey(e.target.value);
    } else {
      return false;
    }
  };

  const onBoosterImageChange = async (event) => {
    let type = event.target.files[0]?.type.split("/");
    const file = event.target.files[0];
    if (type?.length) {
      if (type[0] === "image") {
        if (event.target.files && event.target.files[0]) {
          if (event.target.files[0].size > 2 * 1024 * 1024) {
            alert.error("File Size is too large. Allowed file size is 2MB");
            let myImage = document.getElementById("boosterImage");
            myImage.value = "";
            return false; // do not process the file if it exceeds the size limit
          }
          setBoosterImagePreview(URL.createObjectURL(file));
          setBoosterImage(file);
          let postJson = {
            contentType: file.type,
            folderType: "booster",
          };
          let path = apiUrl.pre_signed_url_generate;
          const fr = await Helper.post(token, postJson, path);
          const res = await fr.response.json();
          if (fr.status === 200) {
            if (res.success) {
              setImagePresignedUrl(res.results.url);
              setImagePresignedKey(res.results.key);
            } else {
              alert.error(res.msg);
            }
          } else {
            alert.error(res.error);
          }
        }
      } else {
        alert.error("Only jpg, .jpeg and png image are allowed");
        let myImage = document.getElementById("banner_pic");
        myImage.value = "";
      }
    }
  };
  const onBoosterImageIconChange = async (event) => {
    let type = event.target.files[0]?.type.split("/");
    const file = event.target.files[0];
    if (type?.length) {
      if (type[0] === "image") {
        if (event.target.files && event.target.files[0]) {
          if (event.target.files[0].size > 2 * 1024 * 1024) {
            alert.error("File Size is too large. Allowed file size is 2MB");
            let myImage = document.getElementById("icon_image");
            myImage.value = "";
            return false; // do not process the file if it exceeds the size limit
          }
          setBoosterImageIconPreview(URL.createObjectURL(file));
          setBoosterIconImage(file);
          let postJson = {
            contentType: file.type,
            folderType: "booster",
          };
          let path = apiUrl.pre_signed_url_generate;
          const fr = await Helper.post(token, postJson, path);
          const res = await fr.response.json();
          if (fr.status === 200) {
            if (res.success) {
              setIconPresignedUrl(res.results.url);
              setIconPresignedKey(res.results.key);
            } else {
              alert.error(res.msg);
            }
          } else {
            alert.error(res.error);
          }
        }
      } else {
        alert.error("Only jpg, .jpeg and png image are allowed");
        let myImage = document.getElementById("banner_pic");
        myImage.value = "";
      }
    }
  };

  const handleSearching = async (searchQuery) => {
    query["keywords"] = keywords;
    query["gameType"] = gameType.toString();
    query["page"] = 1;
    query["itemsPerPage"] = 10;
    setActivePage(1);
    let queryString = Helper.serialize(query);
    var path = apiUrl.getBoosterList + `?${queryString}`;
    getBoostersList(path);
  };

  const getBoostersList = async (path) => {
    setVisibale(true);
    const fr = await Helper.get(token, path);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setBoostersList(res.results.docs || []);
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
  };

  const handleEditBooster = (item) => {
    setIsEdit(true);
    handleAddBooster();
    setBoosterName(item?.title);
    setBoosterData(item);
    setBoosterImagePreview(item?.booster_image);
    setBoosterImageIconPreview(item?.image);
    setGameType(item?.gameType);
    setBoosterPrice(item?.price);
    setBoosterDescription(item?.description);
    setMultiplyKey(item?.multiplyBy);
    // setBoosterImage(item?.booster_image);
    // setBoosterIconImage(item?.image);
    setBoosterImagePreview(item?.booster_image);
    setBoosterImageIconPreview(item?.image);
  };

  const pageData = async (page = activepage) => {
    setVisibale(true);
    const itemsPerPage = 10;
    let path;
    setActivePage(page);
    query["page"] = page;
    query["itemsPerPage"] = itemsPerPage;
    let queryString = Helper.serialize(query);
    path = apiUrl.getBoosterList + `?${queryString}`;
    getBoostersList(path);
  };

  useEffect(() => {
    handleSearching();
  }, []);

  return (
    <div className="animated fadeIn loader-outer">
      <Loaders className="overlay-loader" visible={visible} />
      <Row>
        <Col>
          <Card>
            <CardHeader className="align-items-center d-flex">Booster List</CardHeader>
            <div id="reportId">
              <Table hover bordered responsive className="mt-3 text-center">
                <thead>
                  <tr>
                    <th className="text-center">Booster Title</th>
                    <th className="text-center">Booster Name</th>
                    <th className="text-center">Price</th>
                    <th className="text-center">Created Date</th>
                    <th className="text-center">Take Action</th>
                  </tr>
                </thead>
                <tbody>
                  {boostersList.map((item, key) => {
                    return (
                      <tr key={Math.floor(Math.random() * 10000000 + 1)}>
                        <td className="text-left">{item.title}</td>
                        <td className="text-left">{`${item.gameType[0]}${item.gameType[1] ? "," + item.gameType[1] : ""}${
                          item.gameType[2] ? "," + item.gameType[2] : ""
                        }`}</td>
                        <td className="text-left">{item?.price}</td>
                        <td className="text-center">{moment(item?.created_at).format("YYYY-MM-DD")}</td>

                        <td className="text-center">
                          <div>
                            <a className="btn-link" onClick={() => handleEditBooster(item)}>
                              <button className="btn circle_btn btn-sm mr-1" type="button" title="Edit">
                                <i className="fa fa-pencil" />
                              </button>
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
            {!_.isEmpty(boostersList) && (
              <div className="show-pagination technician-page">
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
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Modal isOpen={isModalOpen} toggle={handleCloseModal} className={"custom-modal modal-lg"}>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <ModalHeader toggle={handleCloseModal}>{isEdit ? "Update" : "Add"} Booster</ModalHeader>
          <ModalBody>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label md={12}>
                    <strong>Booster Title</strong>
                  </Label>
                  <input
                    type="text"
                    placeholder="Enter name of the Booster"
                    maxLength={30}
                    value={boostername}
                    className="form-control"
                    name="boosterName"
                    onChange={(e) => handleBoosterName(e)}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label md={12}>
                    <strong>Booster Price</strong>
                  </Label>
                  <input
                    type="number"
                    placeholder="amount"
                    maxLength={6}
                    value={price}
                    className="form-control"
                    name="price"
                    onChange={(e) => handleBoosterPrice(e)}
                  />
                </FormGroup>
              </Col>

              <Col md={multiplyBy == undefined ? 12 : 6}>
                <FormGroup>
                  <Label md={12}>
                    <strong>Description</strong>
                  </Label>
                  <textarea
                    rows={5}
                    cols={7}
                    type="text"
                    maxLength={150}
                    minLength={10}
                    placeholder="Description"
                    value={description}
                    className="form-control"
                    name="description"
                    onChange={(e) => handleDescription(e)}
                  />
                </FormGroup>
              </Col>
              {multiplyBy && (
                <Col md={6}>
                  <FormGroup>
                    <Label md={12}>
                      <strong>Multiply By</strong>
                    </Label>
                    <input
                      type="number"
                      maxLength={150}
                      minLength={10}
                      placeholder="Multiply By"
                      value={multiplyBy}
                      className="form-control"
                      name="multiplyBy"
                      onChange={(e) => handleMultiplyKey(e)}
                    />
                  </FormGroup>
                </Col>
              )}

              <Col md={6}>
                <FormGroup>
                  <Label className={"col-md-6 pull-left mt-2"}>Booster Image</Label>
                  <input
                    id="boosterImage"
                    type="file"
                    onChange={onBoosterImageChange}
                    name="booster_image"
                    className="form-control  col-md-8"
                    autoComplete="off"
                    placeholder="Pic"
                  />
                  <ErrorMessage errors={errors} name="booster_image">
                    {({ message }) => <p className={"text-danger"}>{message}</p>}
                  </ErrorMessage>
                  <img id="target" className={"mt-3 rounded"} height={200} src={preview} />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={"col-md-6 pull-left mt-2"}>Booster Icon</Label>
                  <input
                    id="icon_image"
                    type="file"
                    onChange={onBoosterImageIconChange}
                    name="image"
                    className="form-control  col-md-8"
                    autoComplete="off"
                    placeholder="Pic"
                  />
                  <ErrorMessage errors={errors} name="image">
                    {({ message }) => <p className={"text-danger"}>{message}</p>}
                  </ErrorMessage>
                  <img id="target_icon" className={"mt-3 rounded"} height={200} src={icon_preview} />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <button type="button" className="btn dark_btn" data-dismiss="modal" onClick={handleCloseModal}>
              Close
            </button>
            <button type="submit" className="btn dark_btn" data-dismiss="modal">
              {isEdit ? "Update" : "Add"}
            </button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
};

export default BoosterList;
