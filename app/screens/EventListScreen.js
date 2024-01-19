import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, Pressable } from 'react-native';

import SearchBar from '../components/SearchBar';
import Event from '../components/Event';
import PageHeader from '../components/PageHeader';
import Constants from 'expo-constants';
import NextButton from '../components/NextButton';
import { useNavigation } from '@react-navigation/native';

function EventListScreen({ route, props, navigation }) {
  const { selectedSubjects, selectedCost } = route.params || {};

  console.log("check", selectedSubjects,selectedCost)
  const [searchQuery, setSearchQuery] = useState('');
  const [active, setActive] = useState(true);
  const [eventsAPI, setEvents] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  // useEffect(() => {
  //   fetch(`https://mapstem-api.azurewebsites.net/api/Event?Subject=${selectedSubjects}&Cost=${selectedCost}`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("check data",data)
  //       setEvents(data);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching data:', error);
  //       setLoading(false);
  //     });
  // }, []);

  useEffect(() => {
    
    if (selectedSubjects && selectedCost) {
      fetch(`https://mapstem-api.azurewebsites.net/api/Event?Subject=${selectedSubjects}&Cost=${selectedCost}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setEvents(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    } else {
      fetch('https://mapstem-api.azurewebsites.net/api/Event')
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setEvents(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }
  }, [selectedSubjects, selectedCost]);
  

  
  // useEffect(() => {
  //   if (loading) {
  //     return; 
  //   }

  //   const filteredEvents = eventsAPI.filter((event) =>
  //     event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) &&
  //     ((active && event.eventStatus === 'Active') ||
  //       (!active && event.eventStatus === 'Pending'))
  //   );
  //   setFilteredData(filteredEvents);
  // }, [searchQuery, active, loading]);

  useEffect(() => {
    if (loading) {
      return; // Wait until data is loaded
    }
  
    const filteredEvents = Array.isArray(eventsAPI)
      ? eventsAPI.filter((event) =>
          event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) &&
          ((active && event.eventStatus === 'Active') ||
            (!active && event.eventStatus === 'Pending'))
        )
      : [];
  
    setFilteredData(filteredEvents);
  }, [searchQuery, active, loading, eventsAPI]);

  return (
    <View style={styles.screen}>
      <PageHeader header="All Events" />
      <View style={styles.actpenContainer}>
        <Pressable
          style={[
            styles.actpen,
            active
              ? { borderBottomColor: 'black' }
              : { borderBottomColor: '#999999' },
          ]}
          onPress={() => setActive(true)}
        >
          <Text
            style={[
              styles.actpentxt,
              active ? { fontWeight: '700' } : { fontWeight: '400' },
            ]}
          >
            Active
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.actpen,
            !active
              ? { borderBottomColor: 'black' }
              : { borderBottomColor: '#999999' },
          ]}
          onPress={() => setActive(false)}
        >
          <Text
            style={[
              styles.actpentxt,
              !active ? { fontWeight: '700' } : { fontWeight: '400' },
            ]}
          >
            Pending
          </Text>
        </Pressable>
      </View>
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search for event"
        onPressIcon={() => navigation.navigate('Filter Events')}
        isList={true}
      />
      <FlatList
        data={filteredData}
        keyExtractor={(event) => event.id.toString()}
        renderItem={({ item }) => (
          <Event
            image = {item.imageData}
            heading={item.eventName}
            type = {item.eventType}
            cost={item.cost}
            description={item.description}
            startDate={item.startDate}
            endDate={item.endDate}
            startTime={item.startTime}
            endTime={item.endTime}
            address={item.address}
            companyname={item.compmayName}
            subject={item.subject}
            contact={item.contactNo}
            eligibility={item.eligibility}
            gradeLevel={item.gradeLevel}
            ageGroup={item.ageGroup}
            meal={item.mealIncluded}
            //distance={item.eventDistance}
            navigation={navigation}
            allDetails={item}
          />
        )}
      />
      <NextButton
        title={'Add New Event'}
        onPress={() => navigation.navigate('Create Event')}
      />
    </View>
  );
}

export default EventListScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#f3f3f3',
  },
  actpenContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 10,
    marginTop: 10,
  },
  actpen: {
    borderBottomWidth: 2,
    width: '50%',
  },
  actpentxt: {
    textAlign: 'center',
    fontSize: 15,
  },
});
