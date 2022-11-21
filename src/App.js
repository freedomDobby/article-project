import React from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./App.css";

axios.defaults.withCredentials = true;

function Write() {
  const { loginUser } = React.useContext(StoreContext);
  const navigation = useNavigate();

  const [data, setData] = React.useState({
    title: "",
    body: "",
  });

  const 데이터변경 = (event) => {
    const name = event.target.name;
    const cloneData = { ...data };
    cloneData[name] = event.target.value;
    setData(cloneData);
    console.log(cloneData);
  };

  const 작성 = async () => {
    await axios({
      url: "http://localhost:4000/article",
      method: "POST",
      data: data,
    }).then((response) => {
      if (response.data.code === "success") {
        alert(response.data.message);
        navigation("/");
      }
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: 12 }}>
      <h2>게시글작성</h2>
      <h3>제목</h3>
      <input name="title" onChange={데이터변경} />
      <h3>내용</h3>
      <textarea
        name="body"
        onChange={데이터변경}
        cols="50"
        rows="10"
      ></textarea>
      <button onClick={작성} type="button" style={{ marginTop: 12 }}>
        작성하기
      </button>
    </div>
  );
}

function Join() {
  const navigation = useNavigate();

  const [data, setData] = React.useState({
    id: "",
    pw: "",
  });

  const 데이터변경 = (event) => {
    const name = event.target.name;
    const cloneData = { ...data };
    cloneData[name] = event.target.value;
    setData(cloneData);
  };

  const 회원가입 = async () => {
    await axios({
      url: "http://localhost:4000/join",
      method: "POST",
      data: data,
    })
      .then((res) => {
        const { code, message } = res.data;
        if (code === "success") {
          alert(message);
          navigation("/login");
        }
        console.log(res.data);
      })
      .catch((e) => {
        console.log("join Error", e);
      });
  };

  return (
    <div>
      <input type="text" name="id" onChange={데이터변경} />
      <input type="password" name="pw" onChange={데이터변경} />
      <button type="button" onClick={회원가입}>
        회원가입
      </button>
    </div>
  );
}

function Login() {
  const navigation = useNavigate();
  const [data, setData] = React.useState({
    id: "",
    pw: "",
  });

  const 데이터변경 = (event) => {
    const name = event.target.name;
    const cloneData = { ...data };
    cloneData[name] = event.target.value;
    setData(cloneData);
  };

  const 로그인 = async () => {
    await axios({
      url: "http://localhost:4000/login",
      method: "POST",
      data: data,
    })
      .then((res) => {
        alert(res.data.message);
        if (res.data.code === "success") {
          window.location.href = "/";
        }
        console.log(res.data);
      })
      .catch((e) => {
        console.log("로그인에러", e);
      });
  };

  return (
    <div>
      <input name="id" onChange={데이터변경} />
      <input name="pw" onChange={데이터변경} />
      <button type="button" onClick={로그인}>
        로그인
      </button>
    </div>
  );
}

function Main() {
  const navigation = useNavigate();
  const { loginUser } = React.useContext(StoreContext);
  const [article, setArticle] = React.useState([]);
  /**
   * 게시글(article)을 전부 가져와서
   * Main 페이지에 보여주세요
   * CSS는 어떻게 구현하셔도 상관은 없습니다 (최대한 깔끔하게~)
   * - useState => 가져온거 저장해야겠죠 state로
   * - useEffect => 게시글 가져와야겠죠 서버에서?
   */
  const 게시글정보가져와 = async () => {
    await axios({
      url: "http://localhost:4000/article",
      method: "GET",
    }).then((response) => {
      setArticle(response.data);
    });
  };
  React.useEffect(() => {
    게시글정보가져와();
  }, []);
  const 글등록페이지이동 = () => {
    navigation("/write");
  };
  return (
    <div className="ui-wrap">
      {/* <h2>{loginUser.nickname}님 안녕하세요!</h2> */}
      <button className="ui-green-button" onClick={글등록페이지이동}>
        글등록
      </button>
      <table className="ui-table">
        <thead>
          <tr>
            <th>제목</th>
            <th>내용</th>
            <th>작성자</th>
          </tr>
        </thead>
        <tbody>
          {article.length > 0 &&
            article.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.title}</td>
                  <td>{item.body}</td>
                  <td>{item.nickname}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

const StoreContext = React.createContext({});

function App() {
  const [loginUser, setLoginUser] = React.useState({});

  const 세션정보가져오기 = async () => {
    await axios({
      url: "http://localhost:4000/user",
      method: "GET",
    }).then((res) => {
      console.log(res.data);
      setLoginUser(res.data);
    });
  };

  React.useEffect(() => {
    세션정보가져오기();
  }, []);
  return (
    <StoreContext.Provider
      value={{
        loginUser,
      }}
    >
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route exact path="/join" element={<Join />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/write" element={<Write />} />
      </Routes>
    </StoreContext.Provider>
  );
}

export default App;
