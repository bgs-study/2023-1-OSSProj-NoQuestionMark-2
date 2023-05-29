import {useState} from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { AiFillCloseCircle } from "react-icons/ai";
import styled from 'styled-components';
import SubmitButton from '../Components/SubmitButton';
import {ModalToggle, EventSourceInput} from 'interfaces/CalendarState';
import * as Api from '../lib/Api';

const ModalConatiner = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index : 999;
`;
const Form = styled.form`
  position: absolute;
  width: 25%;
  min-width: 385px;
  padding: 30px;
  text-align: center;
  background-color: rgb(255, 255, 255);
  border-radius: 20px;
  box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);
`;
const CloseButton = styled(AiFillCloseCircle)`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 20px;
  height: 20px;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: 0.2fr 0.8fr;
  grid-gap: 0.5rem;
  justify-content : left;
  text-align: left;
  font-size: 13px;
  width: 80%;
  margin: 2rem auto;
  padding: 2rem 2rem;
`;
const InputDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
`;
const StyledSelect = styled.select`
  width: 100%;
  height: 35px;
  font-size: 13px;
  border-radius: 5px;
  border: 1px solid #666;
  padding: 0 12px;
`;
const StyledInput = styled.input`
  width: 91%;
  height: 35px;
  font-size: 13px;
  border: 1px solid #666;
  border-radius: 5px;
  padding: 0 12px;
`;
const StyledTextarea = styled.textarea`
  width: 91%;
  height: 200px;
  font-size: 13px;
  border: 1px solid #666;
  border-radius: 5px;
  padding: 10px 12px;
`;
const EditButton = styled.button`
  display: block;
  outline: none;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  text-align: center; 
  cursor: pointer;
  padding-left: 1rem;
  padding-right: 1rem;
  margin-right : auto;
  background-color: #228be6;
  width: 10rem;
  height: 2rem;
`;
const CDButton = styled.button`
  display: block;
  outline: none;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  text-align: center; 
  cursor: pointer;
  padding-left: 1rem;
  padding-right: 1rem;
  margin-left : auto;
  background-color: #228be6;
  width: 10rem;
  height: 2rem;
`;
const ButtonLine = styled.div`
  display: flex;
  padding-top: 0.5rem;
  justify-content: space-between;
`;
const ButtonWapper = styled.div`
  margin: 0 auto;
  padding-bottom: 0.5rem;
  width: 22rem;
`;

const SubjectDetailProf = ({handleModalToggle,subjectList,event,id}: ModalToggle) => {
  const formData = {...event};

  const [edited, setEdited] = useState(false)

  const onClickEditButton = () => {
    setEdited(true);
  };

  const onClickReadButton = () => {
    setEdited(false);
  };

  const {     
    register,
    handleSubmit,
  } = useForm<EventSourceInput>({mode : 'onBlur'})

  const onSubmit: SubmitHandler<EventSourceInput> = data => putSchedule(data);
  const putSchedule = async ({ title, contents,scheduleType, importance, startDate, endDate }:EventSourceInput) => {
		try {
			const putData = { title, contents,scheduleType, importance, startDate, endDate  };
			//await Api.put(`/schedule/subjectArticleId/${id}`, putData).then((res) => {
      //  alert('정상적으로 일정이 등록되었습니다.');
			//});
      handleModalToggle('subject');
		} catch (e) {
			alert(e);
		}
	};

  return (
    <ModalConatiner>      
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h1>과목 일정 상세보기</h1>
        <CloseButton onClick ={()=>handleModalToggle('subject')}/>
        <Grid>
        <label htmlFor='title'>제목</label>
        <InputDiv>
          <StyledInput
            id='title'
            type='text'
            value={formData.title}
            placeholder='제목을 입력해주세요.'
            {...register('title', { required: true })} 
            readOnly={edited ? false : true}/>
        </InputDiv>
        <label htmlFor='contents'>상세내용</label>
        <InputDiv>
          <StyledTextarea 
            id='contents' 
            value={formData.contents}
            placeholder='상세내용을 입력해주세요.'
            readOnly={edited ? false : true}/>
        </InputDiv>
        <label htmlFor='className'>과목명</label>
        <InputDiv>
          <StyledSelect id='className' value={formData.className} {...register('className', { required: true })} disabled={edited ? false : true}>
            {subjectList?.map((el)=> <option value={el.subjectName}>{el.subjectName}</option>)}
          </StyledSelect>
        </InputDiv>
        <label htmlFor='importance'>일정 종류</label>
        <InputDiv>
          <StyledSelect id='importance' value={formData.scheduleType} {...register('importance', { required: true })} disabled={edited ? false : true}>
            <option value='ASSIGNMENT'>ASSIGNMENT</option>
            <option value='PRESENTATION'>PRESENTATION</option>
            <option value='TEST'>TEST</option>
          </StyledSelect>
        </InputDiv>
        <label>시작 날짜</label>
        <InputDiv>
          <input type='datetime-local' value={formData.startDate} {...register('startDate', { required: true })} readOnly={edited ? false : true}></input>
        </InputDiv>
        <label>마감 날짜</label>
        <InputDiv>
          <input type='datetime-local' value={formData.endDate}  readOnly={edited ? false : true}></input>
        </InputDiv>
        </Grid>
        {edited ? ( 
          <ButtonWapper>
            <ButtonLine>
              <EditButton type='submit'>수정완료</EditButton>
              <CDButton type='button' onClick={()=>{onClickReadButton()}}>취소하기</CDButton>
            </ButtonLine>
          </ButtonWapper> ) : ( 
          <ButtonWapper> 
            <ButtonLine>
              <EditButton type='button' onClick={()=>{onClickEditButton()}}>수정하기</EditButton>
              <CDButton type='button'>삭제하기</CDButton>
            </ButtonLine>
          </ButtonWapper>)}
      </Form>
    </ModalConatiner>
  )
}

export default SubjectDetailProf