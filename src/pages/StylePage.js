import { useState, useEffect } from 'react';
import { Routes, Route, useParams, useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import StyleInfo from './style-tabs/StyleInfo';
import StyleSamples from './style-tabs/StyleSamples';
import StyleSpecs from "./style-tabs/StyleSpecs";
import { 
    StylePageLayout,
    StyleMenu
} from "core";


function StylePage( props ) {

    const [token, setToken] = useState(window.localStorage.getItem('mini-plm-access') ?? '');
    const [tab, setTab] = useState("Overview")

    const [samples, setSamples] = useState([]);
    const [sampleCount, setSampleCount] = useState();
    const [WO, setWO] = useState("SMS");

    const BACKEND_URL_STYLES = process.env.REACT_APP_BACKEND_URL_STYLES;

    const [currentStyle, setCurrentStyle] = useState();
    const [loading, setLoading] = useState(true);
    const [specLoading, setSpecLoading] = useState(true);

    const [postResponse, setPostResponse] = useState();
    const [postError, setPostError] = useState();
    const [postLoading, setPostLoading] = useState();

    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const controller = new AbortController();
    const styleUrl = location.pathname;

    const Style = {
        StyleId: params["id"],
        Attributes: "StyleInfo, StyleImages"
    }

    const styleid = params["id"];

    const styleLinks = [
        { 
            id: 1,
            name: "Overview",
            url: '/'
        },
        {
            id: 2,
            name: "Images",
            url: "/images"
        },
        {
            id: 3,
            name: "Samples",
            url: "/samples"
        },
        {
            id: 4,
            name: "Specs",
            url: "/specs"
        },
        {
            id: 5,
            name: "Grading",
            url: "/grading"
        },
        {
            id: 6,
            name: "BOM",
            url: "/bom"
        },
        {
            id: 7,
            name: "Construction",
            url: "/construction"
        },
        {
            id: 8,
            name: "Costs",
            url: "/costs"
        },
    ]

    const fetchStyle = async (style, token) => {
  
        try{
            const res = await axios.get(
                (BACKEND_URL_STYLES + `/${style.StyleId}`),
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    },
                    params: {
                        attributes: style
                    }
                }
            )
            console.log('Response: ' + JSON.stringify(res.data));

            setCurrentStyle((res.data)["Item"]["StyleInfo"])

            console.log(currentStyle);
        }catch(err){
            console.log('Error: ' + JSON.stringify(err.message));
        }finally{
            setLoading(false);
        }
    }

    const fetchSamples = async (style, token, runOnLoad) => {
        let spl;
        let splCt;

        try{
            const res = await axios.get(
                (BACKEND_URL_STYLES + `/${style.StyleId}`),
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    },
                    params: {
                        attributes: style
                    }
                }
            )
            console.log('Response: ' + JSON.stringify(res.data));

            spl = (res.data)["Item"]["StyleSamples"]
            splCt = (res.data)["Item"]["StyleSamples"].length

            if(runOnLoad){
                setSamples(spl);
                setSampleCount(splCt)
            }
        }catch(err){
            console.log('Error: ' + JSON.stringify(err.message));
        }finally{
            setLoading(false);
            if(!runOnLoad){
                return ([spl, splCt]);
            }
        }
    }

    const fetchSpecs = async (style, token, nested) =>{
        let specs;
    
        try{
          const res = await axios.get(
              (BACKEND_URL_STYLES + `/${style.StyleId}`),
              {
                  headers: {
                      Authorization: 'Bearer ' + token
                  },
                  params: {
                      attributes: style
                  }
              }
          )
          console.log('Response: ' + JSON.stringify(res.data));
    
          specs = (res.data)["Item"]["StyleSpecs"]
        }catch(err){
            console.log('Error: ' + JSON.stringify(err.message));
        }finally{ 
          if(!nested){
            setSpecLoading(false)
          };
          return (specs);
        }
      }

    const submitCreateSample = async (wo) => {
        try {
            const res = await axios.post(
                (BACKEND_URL_STYLES + '/addSample'), 
                wo,
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            );
            
            console.log(wo);
            console.log('Response: ' + JSON.stringify(res.data) );
            setPostResponse(JSON.stringify(res.data));

        } catch(err){
            console.log('Error: ' + JSON.stringify(err.message));
            setPostError(JSON.stringify(err.message));
        } finally {
            fetchSamples(Style, token, true);
            setWO('null');
            setPostLoading(false);
            navigate(0);
        }
    }
    

    useEffect(()=>{
        fetchStyle(Style, token);
        console.log(styleUrl);
        return() => controller.abort();
    }, [token]);

    return(
        <>
        {!loading &&
            <StylePageLayout>

                <StyleMenu
                    mode='stylePage'
                    styleid={styleid}
                    stylename={currentStyle.StyleName}
                    alignment="flex-end"
                    styleLinks = {styleLinks}
                    styleUrl = {styleUrl}
                    tab = {tab}
                    setTab = {setTab}
                    {...props}
                />

                <Routes>
                    <Route
                        path = "/*"
                        element = {
                            <StyleInfo
                                styleid={styleid}
                                styleDetails = {currentStyle}
                                token = {token}
                                {...props}
                            />
                        }
                    />
                    <Route
                        path = "/samples"
                        element = {
                            <StyleSamples
                                styleid={styleid}
                                token={token}
                                fetchSamples={fetchSamples}
                                fetchSpecs = {fetchSpecs}
                                submitCreateSample = {submitCreateSample}
                                samples = {samples}
                                sampleCount = {sampleCount}
                                WO = {WO}
                                setWO = {setWO}
                                BACKEND_URL_STYLES = {BACKEND_URL_STYLES}
                                {...props}
                            />
                        }
                    />
                        <Route
                        path = "/specs"
                        element = {
                            <StyleSpecs
                            token = {token}
                            styleid = {styleid}
                            fetchSamples = {fetchSamples}
                            fetchSpecs = {fetchSpecs}
                            samples = {samples}
                            sampleCount = {sampleCount}
                            BACKEND_URL_STYLES = {BACKEND_URL_STYLES}
                            {...props}
                        />
                        }
                    />
                </Routes>

            </StylePageLayout>
        }
        </>
    )
}

export default StylePage;