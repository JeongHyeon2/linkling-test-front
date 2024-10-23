import React, { useState } from "react";
import axios from "axios";

function ImageDisplay() {
  const [filename, setFilename] = useState(""); // 사용자가 입력한 파일 이름
  const [imageSrc, setImageSrc] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    setFilename(event.target.value); // 입력된 파일 이름을 업데이트
  };

  const handleSubmit = async () => {
    try {
      // 이미지 파일 이름을 서버로 전달
      const response = await axios.get(`http://localhost:8080/image`, {
        params: { name: filename }, // 서버로 파일 이름을 쿼리 파라미터로 전달
        responseType: "blob", // 이미지 데이터를 blob으로 받기 위해 설정
      });

      // Blob을 이용해 이미지 URL 생성
      const imageUrl = URL.createObjectURL(response.data);
      setImageSrc(imageUrl);
      setError(null); // 성공 시 에러 상태 초기화
    } catch (err) {
      setError("이미지를 불러오는 데 실패했습니다.");
      setImageSrc(null); // 에러 시 이미지를 비우기
    }
  };

  return (
    <div>
      <h1>이미지 불러오기</h1>
      {/* 사용자가 파일 이름을 입력하는 input */}
      <input
        type="text"
        value={filename}
        onChange={handleInputChange}
        placeholder="파일 이름을 입력하세요"
      />
      <button onClick={handleSubmit}>이미지 요청</button>

      {/* 이미지 또는 에러 메시지 출력 */}
      {error && <div>{error}</div>}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={filename}
          style={{ maxWidth: "100%", height: "auto", marginTop: "10px" }}
        />
      )}
    </div>
  );
}

export default ImageDisplay;
