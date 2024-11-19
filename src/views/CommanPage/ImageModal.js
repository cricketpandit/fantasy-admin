import Modal from "react-modal";
import React from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

export default function ImageModal({ handleClose, modalImages, openModal}) {

   const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "50%",
      height: "auto",
    },
  };
  return (
    <div className="App">
      <Modal
        ariaHideApp={false}
        closeTimeoutMS={200}
        style={customStyles}
        isOpen={openModal}
        onRequestClose={handleClose}
        contentLabel="Image modal"
      >
        <div
          data-action="a-popover-floating-close"
          style={{ paddingBottom: 1, visibility: "visible" }}
        >
          <div
            className="edit-img-modal productdetail-edit-modal a-popover a-popover-modal a-declarative  a-popover-modal-fixed-height"
            data-action="a-popover-a11y"
            aria-modal="true"
            role="dialog"
            aria-labelledby="a-popover-label-6"
            id="a-popover-6"
            style={{
              maxHeight: "none",
              maxWidth: "none",
              visibility: "visible",
              position: "relative",
              top: 0,
              left: 0,
              opacity: 1,
              transform: "translateY(0px)",
            }}
            aria-hidden="false"
          >
            <button type="button" className="close" onClick={handleClose}>
              <span aria-hidden="true">&times;</span>
            </button>
            &nbsp;
            <div className="a-popover-wrapper" aria-busy="false">
              <div
                className="a-popover-inner"
                id="a-popover-content-6"
                style={{ height: "auto", paddingBottom: 15 }}
              >
                <div id="iv-tab-view-container">
                  <div
                    id="ivImagesTab"
                    className="iv-box iv-box-tab iv-tab-content"
                    style={{ display: "block" }}
                  >
                    <div className="iv-box-inner">
                      <div
                        id="ivMain"
                        data-csa-c-type="modal"
                        data-csa-c-component="imageBlock"
                        data-csa-c-content-id="image-block-immersive-view-images-tab"
                        data-csa-c-id="vifu7r-46ulgp-pk9tms-lvdq61"
                      >
                        <div id="ivStage">
                          <div
                            id="ivLargeImage"
                            style={{
                              display: "block",
                              opacity: 1,
                              visibility: "visible",
                              cursor: "zoom-in",
                            }}
                          >                            
                              <ImageGallery  items={modalImages}/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
