import React from 'react';
import { useState, useEffect } from 'react';
import fetchImages from "./API/fetchImages";
import Searchbar from "./Searchbar/Searchbar";
import ImageGallery from "./ImageGallery/ImageGallery";
import Button from "./Button/Button";
import Loader from "./Loader/Loader";
import Modal from "./Modal/Modal";

export const App = () => {
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentSearch, setCurrentSearch] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalImg, setModalImg] = useState('');
    const [modalAlt, setModalAlt] = useState('');

  const handleSubmit = async event => {
    event.preventDefault();
    setIsLoading(true);
    const inputForSearch = event.target.elements.inputForSearch;
    if (inputForSearch.value.trim() === '') {
      return;
    }
    const response = await fetchImages(inputForSearch.value, 1);
    setImages(response);
    setIsLoading(false);
    setCurrentSearch(inputForSearch.value);
    setPageNumber(1);
  };

  const handleClickMore = async () => {
  
    const response = await fetchImages(currentSearch, pageNumber + 1);
    setImages([...images, ...response]);
    setPageNumber(pageNumber + 1);
  };

  const handleImageClick = event => {
    setModalOpen(true);
    setModalAlt(event.target.alt);
    setModalImg(event.target.name);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalAlt('');
    setModalImg('');
  };

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.code === 'Escape') {
        handleModalClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridGap: '16px',
        paddingBottom: '24px',
      }}
    >
      {isLoading ? (
          <Loader />
        ) : ( 
          <React.Fragment>
            <Searchbar onSubmit={handleSubmit} />
            <ImageGallery
              onImageClick={handleImageClick}
              images={images}
            />
            {images.length > 0 && images.length < 500 && images.length / 12 === pageNumber ?
            ( 
              <Button onClick={handleClickMore} />
            ) : null}
          </React.Fragment>
        )}
        {modalOpen ? (
          <Modal
            src={modalImg}
            alt={modalAlt}
            handleClose={handleModalClose}
          />
        ) : null}
    </div>
  );
};
