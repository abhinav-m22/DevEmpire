import { useRouter } from 'next/router';
import React ,{useState}from 'react'
import Card from '../components/Card/Card';
import NoResults from '../components/NoResults';
import AmbassadorDatas from "../components/ambassador/Ambassador-Data";
import ProgramsDatas from "../components/programs/Programs-Data";
import WebData from "../components/web-dev/Web-dev-data";
import GamesData from "../components/games/Games-Data";
import JstoolkitsData from "../components/js-toolkits/JSToolkits-Data";
import ReactPaginateComponent from "../components/ReactPaginateComponent";

const Content = () => {
  const Datas = AmbassadorDatas.concat(ProgramsDatas, WebData, GamesData, JstoolkitsData);
  const [pageNumber, setPageNumber] = useState(0);
  const [filteredPageNumber, setfilteredPageNumber] = useState(0);

  const cardsPerPage = 12;
  const router = useRouter();
  var searchTerm = router.query.term;
  if(!searchTerm){
    () => router.push('/')
    searchTerm="";
  }
  const searchResults =
    searchTerm !== ""
      ? Datas.filter((data) =>
        data.head.toLowerCase().includes(searchTerm.toLowerCase()) || data.about.toLowerCase().includes(searchTerm.toLowerCase())
      ).map((data) => {
          let newHead = data.head.replace(
            new RegExp(searchTerm, 'gi'),
            match => `<mark style = "background: #2769AA; color: white;">${match}</mark>`
          )
          let newAbout = data.about.replace(
            new RegExp(searchTerm, 'gi'),
            match => `<mark style = "background: #2769AA; color: white;">${match}</mark>`
          )
          return {
            ...data,
            head: newHead,
            about: newAbout
          }
        })
      : [];

  
  const cardsVisited = pageNumber * cardsPerPage;
  const filteredCardsVisited = filteredPageNumber * cardsPerPage;

  const displayCards = searchResults.slice(
    searchTerm !== "" ? filteredCardsVisited : cardsVisited,
    (searchTerm !== "" ? filteredCardsVisited : cardsVisited) + cardsPerPage
  );
  const pageCount = Math.ceil(searchResults.length / cardsPerPage);

  const changePageNumber = ({ selected }) => {
    if (searchTerm !== "") {
      setfilteredPageNumber(selected);
    } else {
      setPageNumber(selected);
    }
  };

  return (
    <div className="container result-container" id="container">
      {displayCards.length ? (
        <div className="search-result-count">
          Showing {searchResults.length} results found ...
        </div>
      ) : (
        <></>
      )}
      <div className="align-flex">
        {displayCards.length > 0 ? (
          displayCards.map((data, index) => (
            <Card
              key={index}
              about={data.about}
              alt={data.alt}
              head={data.head}
              image={data.image}
              link={data.link}
            />
          ))
        ) : (
          <NoResults search={searchTerm} />
        )}
      </div>
      <ReactPaginateComponent
        pageNumber={pageNumber}
        pageCount={pageCount}
        changePage={changePageNumber}
        forcePage={searchTerm !== "" ? filteredPageNumber : pageNumber}
      />
    </div>
  );
}

export default Content;