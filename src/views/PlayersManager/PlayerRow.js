import React, { useState, useEffect } from "react";
import { FormGroup } from "reactstrap";
import "react-datepicker/dist/react-datepicker.css";
import useSession from "react-session-hook";
import Helper from "../../constants/helper";
import apiUrl from "../../constants/apiPath";
import { useAlert } from "react-alert";
import axios from "axios";

const PlayerRow = (props) => {
  const session = useSession();
  const alert = useAlert();
  const [item, setItem] = useState("");
  const [sno, setKey] = useState("");
  const [isupdate] = useState(false);
  const [token] = useState(session.token);
  const [player_image, setPlayerImage] = useState("");
  const [player_id, setPlayerId] = useState(props.item.player_id);
  const [player_credit, setPlayerCredit] = useState(0.0);
  const [playing_role, setPlayingRole] = useState("");
  const [t10, setT10] = useState(false);
  const [t20, setT20] = useState(false);
  const [odi, setOdi] = useState(false);
  const [test, setTest] = useState(false);
  const [presignedKey, setPresignedKey] = useState("");
  const [presignedUrl, setPresignedUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [image, setImage] = useState(props.item.image && !props.item.image?.includes('noImage.png')
  ? process.env.REACT_APP_AWS_MEDIA_URL + '/' + props.item.image
  : props.item.image);

  const handleChange = (e) => {
    if (e.target.name === "player_credit") {
      setPlayerCredit(e.target.value);
    } else if (e.target.name === "playing_role") {
      setPlayingRole(e.target.value);
    }
  };

  const submitChange = async () => {
    if (Number(player_credit) > 0) {
      const teamReader = new FileReader();
      if (player_image) {
        teamReader.readAsArrayBuffer(player_image);
      }
      let isPlayerImageUploaded = false;
      teamReader.onloadend = async () => {
        const binaryData = teamReader.result;
        const resp = await axios.put(presignedUrl, binaryData, {
          headers: {
            "Content-Type": "application/octet-stream",
          },
        });
        if (resp?.status === 200) {
          isPlayerImageUploaded = true;
        }
      };
      if (isPlayerImageUploaded || image) {
        let postJson = {
          player_id: player_id,
          player_credit: player_credit,
          playing_role: playing_role,
          // t10: t10,
          // t20: t20,
          // odi: odi,
          // test: test,
          is_playing: isPlaying,
          player_image: presignedKey,
        };
        let path = apiUrl.update_player_info;
        const fr = await Helper.post(token, postJson, path);
        const res = await fr.response.json();
        isPlayerImageUploaded = false;
        if (fr.status === 200) {
          if (res.success) {
            setPresignedKey("")
            setPresignedUrl("")
            setPlayerImage("")
            alert.success(res.msg);
          } else {
            alert.error(res.msg);
          }
        } else {
          alert.error(res.error);
        }
      }
    } else {
      alert.error("Credit can't be in negative");
    }
  };

  // const onImageChange = (event) => {
  //   if (event.target.files && event.target.files[0]) {
  //     setPlayerImage(event.target.files[0]);
  //     setImage(URL.createObjectURL(event.target.files[0]));
  //   }
  // };
  const onImageChange = async (event) => {
    let type = event.target.files[0]?.type.split("/");
    const file = event.target.files[0];
    if (type?.length) {
      if (type[0] === "image") {
        if (event.target.files && event.target.files[0]) {
          setImage(URL.createObjectURL(event.target.files[0]));
          setPlayerImage(event.target.files[0]);
          let postJson = {
            contentType: file.type,
            folderType: 'player'
          };
          let path = apiUrl.pre_signed_url_generate;
          const fr = await Helper.post(token, postJson, path);
          const res = await fr.response.json();
          if (fr.status === 200) {
            if (res.success) {
              setPresignedUrl(res.results.url);
              setPresignedKey(res.results.key);
            } else {
              alert.error(res.msg);
            }
          } else {
            alert.error(res.error);
          }
        }
      } else {
        alert.error("Only jpg, .jpeg and png image are allowed");
        let myImage = document.getElementById("subAdminImage");
        myImage.value = "";
      }
    }
  };

  useEffect(() => {
    setPlayerId(props.item.player_id);
    setPlayerCredit(props.item.player_credit);
    setPlayingRole(props.item.playing_role);
    setT10(props.item.t10 === "True" ? true : false);
    setT20(props.item.t20 === "True" ? true : false);
    setOdi(props.item.odi === "True" ? true : false);
    setTest(props.item.test === "True" ? true : false);
    setIsPlaying(props.item.is_playing);
    setImage(
      props.item.image && !props.item.image?.includes('noImage.png')
        ? process.env.REACT_APP_AWS_MEDIA_URL + '/' + props.item.image
        : props.item.image
    );
    setItem(props.item);
    setKey(props.sno);
  }, [props.item]);

  return (
    <tr key={sno}>
      <td className="text-left">{props.item.player_name}</td>
      <td className="text-left">
        <img width="80px" src={image} />

        <input type="file" onChange={onImageChange} name="player_image" className="form-control  col-md-8" autoComplete="off" placeholder="Pic" />
      </td>
      <td className="text-center">
        <FormGroup className={"mb-0"}>
          <select
            type="select"
            name="playing_role"
            placeholder="Status"
            className="form-control"
            value={playing_role}
            defaultValue={props.item.playing_role}
            onChange={handleChange}
          >
            <option value="">Player Role</option>
            <option value="Bowler">Bowler</option>
            <option value="Batsman">Batsman</option>
            <option value="Wicketkeeper">Wicketkeeper</option>
            <option value="Allrounder">Allrounder</option>
          </select>
        </FormGroup>
      </td>
      {/* <td className="text-center w-40">
        <span style={{color:'#000'}}>
          <input type="checkbox" name="t10" value={t10} checked={t10} onChange={() => setT10(!t10)} /> T10 &nbsp;
        </span>
        <span style={{color:'#000'}}>
          <input type="checkbox" name="t20" value={t20} checked={t20} onChange={() => setT20(!t20)} /> T20 &nbsp;
        </span>
        <span style={{color:'#000'}}>
          {" "}
          <input type="checkbox" name="odi" value={odi} checked={odi} onChange={() => setOdi(!odi)} /> ODI &nbsp;
        </span>
        <span style={{color:'#000'}}>
          {" "}
          <input type="checkbox" name="test" checked={test} onChange={() => setTest(!test)} /> TEST &nbsp;
        </span>
      </td> */}
      <td className="text-left w-40">{item.team_name}</td>
      <td className="text-left w-40">{item.series_name}</td>
      <td className="text-right w-40">
        <input
          type="number"
          name="player_credit"
          step=".01"
          min={"0"}
          placeholder="Credit"
          autoComplete="off"
          className="form-control col-md-8"
          value={player_credit}
          defaultValue={props.item.player_credit}
          onChange={handleChange}
        />
      </td>
      <td className="text-center">
        <button onClick={submitChange} className="btn circle_btn table_auto_btn  mr-1 col-md-12" type="button">
          {" "}
          Update
          {isupdate === true && <i className="fa fa-spinner fa-pulse fa-fw ml-1" />}
        </button>
      </td>
    </tr>
  );
};

export default PlayerRow;
