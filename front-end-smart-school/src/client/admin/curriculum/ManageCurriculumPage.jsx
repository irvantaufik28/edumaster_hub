import SideBar from "../../../components/layouts/SideBar";
import Topbar from "../../../components/layouts/TopBar";
import ButtonPrimary from "../../../components/ui/button/ButtonPrimary";
import HeaderContentGlobal from "../../../components/ui/header/HeaderContentGlobal";
import { Button, Card, Col, Row, Table } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { SiAddthis } from "react-icons/si";
import { useDispatch, useSelector } from "react-redux";
import { curriculumSelector, getByIdCurriculum } from "../../../features/curriculumSlice";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const ManageCurriculumPage = () => {
    const {id} = useParams()
    const dispatch = useDispatch()
    const curriculum = useSelector(curriculumSelector.selectAll)

    
    const classroomSchedule = curriculum?.classroom_schedule

    useEffect(() => {
        dispatch(getByIdCurriculum(id))
    },[dispatch, id])
    
    const handleDelete = (id) => {
        alert(id)
    }
  return (
    <>
      <Topbar />
      <div className="content">
        <SideBar />
        <div className="main-content">
          <HeaderContentGlobal
            page={"Curriculum"}
            title={"Curriculum"}
            type={"Manage"}
          />
          <div className="main-content-alpha">
            <Card
              style={{ width: "100%", height: "auto", marginBottom: "20px" }}
            >
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Table>
                      <tbody>
                        <tr>
                          <th className="no-border" width="150">
                            Curriculum Name
                          </th>
                          <td className="no-border">
                            : <span id="text-name">{curriculum?.name}</span>
                          </td>
                        </tr>
                        <tr>
                          <th className="no-border" width="150">
                            Grade
                          </th>
                          <td className="no-border">
                            :{" "}
                            <span id="text-level">
                              {curriculum?.level}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                  <Col md={6}>
                    <Table>
                      <tbody>
                        <tr>
                          <th className="no-border" width="150">
                            Year Group
                          </th>
                          <td className="no-border">
                            :{" "}
                            <span id="text-year_group">
                            {curriculum?.year_group}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <th className="no-border" width="150">
                            Semester
                          </th>
                          <td className="no-border">
                            : <span id="text-semester"> {curriculum?.semester}</span>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Row>
              <Col md={6}>
                <div className="title-form-student">Courses List</div>
              </Col>

              <div className="button-edit-current-classroom">
                <ButtonPrimary
                  title="Add Course"
                  icon={<SiAddthis />}
                //   onClick={() => handleAdd()}
                />
              </div>
              {classroomSchedule?.length ? (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th className="th-react-table ">No</th>
                      <th className="th-react-table ">Course</th>
                      <th className="th-react-table ">Type</th>
                      <th className="th-react-table ">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classroomSchedule?.map((item, index) => (
                      <tr key={item.id}>
                        <td>
                          {index + 1}
                        </td>
                        <td>{item?.courses?.name} Kelas {item?.courses?.level}</td>
                        <td>{item?.courses?.type}</td>
                     
                        <td>
                          {" "}
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(item?.id)}
                          >
                            <MdDelete /> Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Card style={{ width: "100%", height: "auto" }}>
                  <Card.Body style={{ textAlign: "center" }}>
                    <p>No data available </p>
                  </Card.Body>
                </Card>
              )}
              {/* <FormModalAddClassromSchedule
                {...formAddModal}
                onHide={handleCloseFormAdd}
                onSuccess={onSubmitSuccess}
              /> */}
              {/* <FormModalEditClassromSchedule
                {...formEditModal}
                onHide={handleCloseFormEdit}
                onSuccess={onSubmitSuccess}
              /> */}
            </Row>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageCurriculumPage;
