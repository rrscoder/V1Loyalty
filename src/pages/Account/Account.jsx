import {View, Text} from 'react-native';
import React from 'react';
import {ScrollView} from 'react-native';
import AccountEachComponent from '../../components/AccountEachComponent';
import { useSelector } from 'react-redux';

const Account = () => {
  const settings = useSelector(state => state.settings.setting);

  return (
    <ScrollView style={{display: 'flex', backgroundColor: '#5387C6',marginTop:-30,paddingTop:30 }}>
      <AccountEachComponent
        title="Account"
        pages={[
          {pageTitle: 'Personal Information', pageName: 'PersonalInformation'},
          {pageTitle: 'Transaction Activity', pageName: 'TransactionActivity'},
        ]}
      />
      <AccountEachComponent
        title="Notifications Preferences"
        pages={[
          {pageTitle: 'Contact Preferences', pageName: 'ContactPreferences'},
        ]}
      />
      <AccountEachComponent
        title="Help & Policies"
        pages={[
          {pageTitle: 'Help', pageName: 'Help'},
          {
            pageTitle: 'Terms & Conditions',
            pageName: 'TermsConditions',
            icon: 'open-outline',
            url: settings?.terms_link,
          },
          {
            pageTitle: 'Privacy Policy',
            pageName: 'PrivacyPolicy',
            icon: 'open-outline',
            url: settings?.privacy_link,
          },
          {
            pageTitle: 'Allergen Information ',
            pageName: 'Allergen Information',
            icon: 'open-outline',
            url: settings?.allergen_link,
          },
          {pageTitle: 'Sign Out', pageName: 'SignOut'},
        ]}
      />
    </ScrollView>
  );
};

export default Account;
