import React from "react";
import { StyleSheet, View, Text, Platform, Image, TouchableOpacity, Button } from "react-native";
import * as Yup from "yup";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppForm from "../components/AppForm";
import AppFormField from "../components/AppFormField";
import PageHeader from "../components/PageHeader";
import Screen from "../components/Screen";
import SubmitButton from "../components/SubmitButton";
import { FontAwesome, EvilIcons, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

const validationSchema = Yup.object().shape({
  heading: Yup.string()
    .required()
    .label("Name")
    .max(50, "Must be shorter than 50 characters"),
  grade: Yup.string()
    .required()
    .label("Grade")
    .max(50, "Must be shorter than 50 characters"),
  ageGroup: Yup.string()
    .required()
    .label("ageGroup")
    .max(50, "Must be shorter than 50 characters"),
  description: Yup.string().required("Please describe the event"),
  subject: Yup.string().required("Please include the STEM subject"),
  location: Yup.string().required("Please include the location"),
  startDate: Yup.date().required("Please include the start date"),
  endDate: Yup.date().min(
    Yup.ref("startDate"),
    "End date must be after start date"
  ),
  cost: Yup.number().positive("Must be greater than 0 (leave blank if 0)"),
});



function CreateEventScreen(props) {


  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const [mealIncludeDropdownOpen, setMealIncludeDropdownOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [endTime, setEndTime] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTimeOpen, setEndTimeOpen] = useState(false);
  const [startTimeOpen, setStartTimeOpen] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState("date");
  const [eventImage, setEventImage] = useState(null);

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access the camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.cancelled === true) {
      return;
    }

    setEventImage(pickerResult);
  };

  const onChangeStartTime = (event, selectedTime) => {
    setStartTimeOpen(false);
    if (selectedTime !== undefined) {
      setStartTime(selectedTime);
    }
  };

  const onChangeEndTime = (event, selectedTime) => {
    setEndTimeOpen(false);
    if (selectedTime !== undefined) {
      setEndTime(selectedTime);
    }
  };
  const onChangeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setStartDate(currentDate);
    setStartOpen(false);
  };
  const onChangeEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setEndDate(currentDate);
    setEndOpen(false);
  };

  const handleSubmit = async (values) => {
    console.log('Form values:', values);
    const formData = new FormData();

    formData.append('EventImage', values.eventImage);
    formData.append('EventName', values.heading);
    formData.append('EventType', values.eventType);
    formData.append('Cost', values.cost.toString());
    formData.append('Description', values.description);
    formData.append('StartDate', values.startDate.toISOString());
    formData.append('EndDate', values.endDate.toISOString());
    formData.append('StartTime', values.startTime.toISOString());
    formData.append('EndTime', values.endTime.toISOString());
    formData.append('Address', values.location);
    formData.append('CompmayName', values.company);
    formData.append('GradeLevel', values.grade);
    formData.append('Subject', values.subject);
    formData.append('ContactNo', values.contact);
    formData.append('Eligibility', values.eligibility);
    formData.append('AgeGroup', values.ageGroup);
    formData.append('MealIncluded', values.mealInclude);

    try {
      console.log('Form values:', values);
      const response = await fetch('https://mapstem-api.azurewebsites.net/api/Event', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.ok) {
        console.log('Event created successfully!');
      } else {
        console.error('Failed to create event:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred:', error.message);
    }
  };


  return (
    <Screen>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid
        extraScrollHeight={Platform.OS === 'ios' ? 130 : 0} // Adjust this value as needed
      >
        <PageHeader header={"Create New Event"} />
        <View style={{ padding: 10, paddingBottom: 75 }}>
          <AppForm
            initialValues={{
              eventImage: "",
              heading: "",
              eventType: "",
              cost: 0,
              description: "",
              startDate: startDate,
              endDate: endDate,
              startTime: startTime,
              endTime: endTime,
              location: "",
              company: "",
              grade: "",
              subject: "",
              contact: "",
              eligibility: "",
              ageGroup: "",
              mealInclude: ""

            }}
            onSubmit={(values) => handleSubmit(values)}
          // validationSchema={validationSchema}
          >
            <TouchableOpacity onPress={handleImagePicker}>
              <Text style={{ marginTop: 20, marginBottom: 5 }}>
                Upload Picture <Text style={{ color: "red" }}>*</Text>
              </Text>
              <View style={styles.addPic}>
                {eventImage ? (
                  <Image source={{ uri: eventImage.uri }} style={{ width: 100, height: 100 }} />
                ) : (
                  <FontAwesome name="plus" size={18} color="#fff" />
                )}
              </View>
            </TouchableOpacity>

            <AppFormField name={"eventImage"} value={eventImage} type="hidden" />
            <AppFormField name={"heading"} label="Event Name" isRequired={true} />
            <AppFormField
              name={"eventType"}
              label="Event Type"
              isRequired={true}
              icon={<FontAwesome name="angle-down" color={"#999"} size={25} />}
              onPress={() => setDropdownOpen(true)}
              onDropdown={true}
            />
            <AppFormField name={"cost"} label="Cost (in dollars)" isRequired={true} />
            <AppFormField
              name={"description"}
              label="Description"
              multiline
              numberOfLines={3}
              isRequired={true}
            />
            <AppFormField
              name={"startDate"}
              label="Start Date"
              isRequired={true}
              icon={
                <EvilIcons
                  name="calendar"
                  color={"#999"}
                  size={28}
                  onPress={() => {
                    setDatePickerMode("date");
                    setStartOpen(true);
                  }}
                />
              }
              value={startDate.toLocaleDateString()}
            />

            {startOpen && (
              <DateTimePicker
                value={startDate}
                mode={datePickerMode}
                display="default"
                onChange={onChangeStartDate}
              />
            )}
            <AppFormField
              name={"endDate"}
              label="End Date"
              isRequired={true}
              value={endDate.toLocaleDateString()}
              icon={
                <EvilIcons
                  name="calendar"
                  color={"#999"}
                  size={28}
                  onPress={() => setEndOpen(true)}
                />
              }
            />
            {endOpen && (
              <DateTimePicker
                value={endDate}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onChangeEndDate}
              />
            )}
            <AppFormField
              name={"startTime"}
              value={startTime.toLocaleTimeString()}
              label="Start Time"
              isRequired={true}
              icon={
                <MaterialIcons
                  name="access-time"
                  color={"#999"}
                  size={25}
                  onPress={() => setStartTimeOpen(true)}
                />
              }
            />
            {startTimeOpen && (
              <DateTimePicker
                value={startTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={onChangeStartTime}
              />
            )}
            <AppFormField
              name={"endTime"}
              label="End Time"
              value={endTime.toLocaleTimeString()}
              isRequired={true}
              icon={
                <MaterialIcons
                  name="access-time"
                  color={"#999"}
                  size={25}
                  onPress={() => setEndTimeOpen(true)}
                />
              }
            />
            {endTimeOpen && (
              <DateTimePicker
                value={endTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={onChangeEndTime}
              />
            )}
            <AppFormField name={"location"} label="Address" isRequired={true} />
            <AppFormField
              name={"company"}
              label="Host/Company Name"
              isRequired={true}
            />
            <AppFormField name={"grade"} label="Grade Level" isRequired={true} />
            <AppFormField
              name={"subject"}
              label="Subject"
              isRequired={true}
              icon={<FontAwesome name="angle-down" color={"#999"} size={25} />}
              onPress={() => setSubjectDropdownOpen(true)}
              onDropdown={true}
            />
            <AppFormField
              name={"contact"}
              label="Contact Number"
              isRequired={true}
            />
            <AppFormField
              name={"eligibility"}
              label="Eligibility"
              multiline
              numberOfLines={3}
            />
            <AppFormField name={"ageGroup"} label="Age Group" isRequired={true} />
            <AppFormField
              name={"mealInclude"}
              label="Meals Include"
              isRequired={true}
              icon={<FontAwesome name="angle-down" color={"#999"} size={25} />}
              onPress={() => setMealIncludeDropdownOpen(true)}
              onDropdown={true}
            />
          </AppForm>
        </View>

        <LinearGradient
          colors={['black', '#5A5A5A']}
          style={{
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
            width: '95%',
            height: 60,
            borderRadius: 10,
            marginVertical: 10,
          }}
          locations={[0.1, 0.9]}
        >
          <TouchableOpacity onPress={() => handleSubmit(values)}>
            <Text style={{
              color: 'white',
              fontSize: 25,
              fontWeight: 'bold',
            }}
            >
              Submit for Approval
              </Text>
          </TouchableOpacity>
        </LinearGradient>
      </KeyboardAwareScrollView>
    </Screen>
  );
}

export default CreateEventScreen;

const styles = StyleSheet.create({
  addPic: {
    width: "100%",
    height: 50,
    backgroundColor: "#999999",
    borderRadius: 5,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});
