import { Fragment, useEffect, useState } from "react"
import { Button, Col, Form, message, Modal, Row, Select } from "antd"
import CategoryService from "../services/CategoryService";
import { AxiosResponse } from "axios";
import {useForm} from "antd/lib/form/Form";
import { SelectOutlined } from '@ant-design/icons';
import { ICategory } from "../models/Category";
import FullCalendar, { DateSelectArg, EventClickArg } from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import { createEventId } from '../event.utils'


const CalendarComponent = () => {
    const categoryService: CategoryService = new CategoryService();
    let events: Map<string, string[]> = new Map<string, string[]>();
    
    
    // **********Hooks*******************
    
    useEffect(() => {
        getCategories();
    }, []);

    const [dataSourceLoading, setDataSourceLoading] = useState(false);
    const [dataSource, setDataSource] = useState<ICategory[]>([]);
    const [selectCategoryForm] = useForm<ICategory>();
    const [selectCategoryFormVisible, setSelectCategoryFormVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<ICategory>();

    // **********Hooks*******************


    const getCategories = () => {
        setDataSourceLoading(true);
        categoryService.getCategories().then((res: AxiosResponse) => {
            let _data: ICategory[] = res.data.map((i: any, index: number) => {
                i['key'] = i['_id'];
                i['index'] = index;
                return i;
            });
            setDataSource(_data);
            setSelectedCategory(_data[0])
            setDataSourceLoading(false);
            
        }).catch((err: any) => {
            message.error(err.toString());
            setDataSourceLoading(false);
        });
    };

    const handleSelectedCategory = () => {
        if (selectCategoryForm.getFieldsValue().name) {
            setSelectedCategory(selectCategoryForm.getFieldsValue());
            closeSelectModal();
        }
        else message.error("You must select one category!")
        
    };
    
    const handleEventClick = (clickInfo: EventClickArg) => {
        if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
            clickInfo.event.remove();
            let date: string = new Date(clickInfo.event._instance!.range.start).toISOString().replace(/T.*$/, '');
            let categoryEvent: string = clickInfo.event.title;
            let categories = events.get(date)
            categories?.forEach((category: string) => {
                if (category === categoryEvent) categories!.splice(categories!.indexOf(category));
            })
          }
    }

    const isThereTheCategoryMarkedOn = (date: string) => {
        let categories: string[] = events.get(date)!;
        if (categories)
            for (let i = 0; i < events.get(date)!.length; i++) 
                if (categories[i] === selectedCategory!.name) 
                    return true;
        return false;
    }

    const handleDateSelect = (selectInfo: DateSelectArg) => {
        if (selectedCategory) {
            if(![...events.keys()].includes(selectInfo.startStr)) {
                if (!isThereTheCategoryMarkedOn(selectInfo.startStr)) {
                    let title = selectedCategory.name;
                    let calendarApi = selectInfo.view.calendar;
                    calendarApi.addEvent({
                        id: createEventId(),
                        title,
                        start: selectInfo.startStr,
                        end: selectInfo.endStr,
                        allDay: selectInfo.allDay
                    });
                    events.set(selectInfo.startStr, [selectedCategory.name]) // new element
                }
            } else {
                if (!isThereTheCategoryMarkedOn(selectInfo.startStr)) {
                    let title = selectedCategory.name;
                    let calendarApi = selectInfo.view.calendar;
                    calendarApi.addEvent({
                        id: createEventId(),
                        title,
                        start: selectInfo.startStr,
                        end: selectInfo.endStr,
                        allDay: selectInfo.allDay
                    });
                    let categories: string[] = events.get(selectInfo.startStr)!;
                    categories.push(selectedCategory.name)
                    events.set(selectInfo.startStr, categories) // add new category to existent element
                }
                else message.error("The category is already marked on this day!")
            }
        }
    }


    //********Modals***************************
    const showSelectModal = () => {
        setSelectCategoryFormVisible(true);
    }

    const closeSelectModal = () => {
        selectCategoryForm.resetFields();
        setSelectCategoryFormVisible(false);
    }

    //********Modals***************************


    return (
        <Fragment>
            <Modal
                width={"100vh"}
                visible = {selectCategoryFormVisible}
                title = "Select Category"
                onCancel={closeSelectModal}
                onOk = {selectCategoryForm.submit} >
                    <Form form={selectCategoryForm} layout={"vertical"} onFinish={handleSelectedCategory}>
                        <Row style = {{marginTop: "3vh"}}>
                            <Col span = {24}>
                                <Form.Item name={"name"} label={"Category"}>
                                    <Select loading = {dataSourceLoading} >{
                                        dataSource.map((category: any) =>
                                            <Select.Option key = {category.key} value = {category.name}> {category.name}</Select.Option>
                                        )}</Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
            </Modal>

            <Row>
                <h3>La categoria seleccionada és: {selectedCategory?.name}</h3>
                <Col span={23}/>
                <Col span={1}>
                    <Button type={"primary"} shape="circle" icon={<SelectOutlined/>} onClick={showSelectModal}/>
                </Col>
            </Row>
            <Row>
                <Col span={10}>
                    <FullCalendar 
                    plugins={[ dayGridPlugin, interactionPlugin ]}
                    initialView="dayGridMonth"
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    select={handleDateSelect}
                    eventClick={handleEventClick}
                    />
                </Col>
            </Row>
        </Fragment>
    );
}

export default CalendarComponent;
