import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { BsDate, formatBsDate } from '@mero-miti/core';
import { MeroMitiModalPicker } from './MeroMitiModalPicker';

export interface MeroMitiMobileInputProps {
  value?: BsDate;
  onChange?: (bsDate: BsDate, adDate: { year: number; month: number; day: number }) => void;
  placeholder?: string;
  format?: string;
  devanagari?: boolean;
  label?: string;
}

export const MeroMitiMobileInput: React.FC<MeroMitiMobileInputProps> = ({
  value,
  onChange,
  placeholder = 'मिति छान्नुहोस्',
  format = 'DD/MM/YYYY',
  devanagari = false,
  label = 'नेपाली मिति (B.S.)'
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<BsDate | undefined>(value);

  const displayText = selectedDate
    ? formatBsDate(selectedDate, { format, numeral: devanagari ? 'ne' : 'en' })
    : placeholder;

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TouchableOpacity
        style={styles.inputBox}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.text, !selectedDate && styles.placeholderText]}>
          {displayText}
        </Text>
        <Text style={styles.calendarIcon}>📅</Text>
      </TouchableOpacity>

      <MeroMitiModalPicker
        visible={modalVisible}
        initialDate={selectedDate}
        devanagari={devanagari}
        onClose={() => setModalVisible(false)}
        onSelect={(bs, ad) => {
          setSelectedDate(bs);
          if (onChange) onChange(bs, ad);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 4,
  },
  inputBox: {
    height: 44,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 14,
    color: '#0f172a',
  },
  placeholderText: {
    color: '#9ca3af',
  },
  calendarIcon: {
    fontSize: 16,
  },
});
