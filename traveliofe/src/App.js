import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Rating } from 'react-simple-star-rating'

function App() {
  const [filter, setfilter] = useState("")
  const [booklist, setbooklist] = useState([])
  const [isbookmark, setisbookmark] = useState([])
  const [bookmarklist, setbookmarklist] = useState([])
  const [isOpenBookmark, setIsOpenBookmark] = useState(false)


  useEffect(()=>{
    getBooklist()
  }, [filter])

  useEffect(()=>{
    if(isOpenBookmark)
    {
      setfilter("")
      setbooklist([])
      setisbookmark([])
      getBookmark()
    }
  }, [isOpenBookmark])

  function handleUnbookmark(book)
  {
    axios.delete('http://localhost:8020/api/bookmarks/delete/' + book.id)
    .then(response => {
      setbookmarklist(bookmarklist.filter(x=>x.id != book.id))
      console.log("Delete successful")
    }).catch(error => {
      // Handle any errors
      console.log(error)
  })
  }

  function getBookmark()
  {
    axios.get('http://localhost:8020/api/bookmarks/all')
    .then(response => {
      console.log(response.data.data)
      setbookmarklist(response.data.data)
    }).catch(error => {
      // Handle any errors
      console.log(error)
  })
  }

  function handleBookmark(book)
  {
    if(isbookmark.findIndex(x=>x==book.id)!=-1) return;
    setisbookmark([...isbookmark, book.id])
    axios.post('http://localhost:8020/api/bookmarks/save',{
      "judul": book.volumeInfo.title,
      "thumbnail": book.volumeInfo.imageLinks.smallThumbnail? book.volumeInfo.imageLinks.smallThumbnail : "",
      "author": book.volumeInfo.authors? book.volumeInfo.authors[0] : "",
      "rating": book.volumeInfo.averageRating? book.volumeInfo.averageRating : 0
    }).then(response => {
      // Access the response data
      console.log("Success");
      // Process the response data here
  })
  .catch(error => {
      // Handle any errors
      console.log(error)
  })}

  function getBooklist()
  {
    axios.get('https://www.googleapis.com/books/v1/volumes?q=' + filter)
    .then(response => {
        // Access the response data
        setbooklist(response.data.items)
        console.log(response.data);
        // Process the response data here
    })
    .catch(error => {
        // Handle any errors
        console.log(error)
    });
  }
  return (
    <div className="App">
      Search: <input style={{marginTop:"10px"}} onChange={(e)=>setfilter(e.target.value)} value={filter}></input>
      <div style={{display:"flex", flexWrap:"wrap"}}>
      {
        isOpenBookmark?<>
         {
          bookmarklist.map(books=>{
            return <div style={{position:"relative", boxShadow:"gray 9px 9px 5px 0px", padding:"10px", width:"300px", margin:"10px"}}> 
                  <h2 style={{whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:"200px"}}>{ books.Judul }</h2>
                  <img src = {books.Thumbnail}></img>
                  <p>Authors:  
                      <span>{books.Author}</span>
                  </p>
                  <p>  <Rating
                    initialValue={books.Rating} iconsCount={5} readonly={true} 
                  /></p>
                <div onClick={()=>handleUnbookmark(books)} style={{position:"absolute", top:"8px", right:"8px", fontSize:"25px", cursor:"pointer"}}>
                  <i class="fa-solid fa-bookmark"></i>
                </div>
              </div>
          })
        } 
        </>:<>
        {
          booklist.map(books=>{
            return <div style={{position:"relative", boxShadow:"gray 9px 9px 5px 0px", padding:"10px", width:"300px", margin:"10px"}}> 
                  <h2 style={{whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:"200px"}}>{ books.volumeInfo.title }</h2>
                  <img src = {books.volumeInfo.imageLinks && books.volumeInfo.imageLinks.smallThumbnail}></img>
                  <p>Authors: 
                      {books.volumeInfo.authors && books.volumeInfo.authors.map(author => {
                        return <span>{author}</span>
                      })}
                  </p>
                  <p>  <Rating
                    initialValue={books.volumeInfo.averageRating} iconsCount={5} readonly={true} 
                  /></p>
                <div onClick={()=>handleBookmark(books)} style={{position:"absolute", top:"8px", right:"8px", fontSize:"25px", cursor:"pointer"}}>
                  {isbookmark.findIndex(x=>x==books.id)!=-1?<i class="fa-solid fa-bookmark"></i>:<i class="fa-regular fa-bookmark"></i>}
                </div>
              </div>
          })
        }
        </>  
      }

   
      </div>

      <button style={{position:"absolute", top:"10px", right:"20px"}} onClick={()=>setIsOpenBookmark(!isOpenBookmark)}> {isOpenBookmark? "Home":"Bookmark List"} </button>
        
    </div>
  );
}

export default App;
