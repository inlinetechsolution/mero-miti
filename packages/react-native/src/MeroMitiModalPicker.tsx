import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import {
  BsDate,
  adToBs,
  bsToAd,
  getDaysInBsMonth,
  NEPALI_MONTHS_NP,
  NEPALI_DAYS_SHORT_NP,
  toNepaliDigits
} from '@mero-miti/core';

export interface MeroMitiModalPickerProps {
  visible: boolean;
  initialDate?: BsDate;
  onSelect: (bsDate: BsDate, adDate: { year: number; month: number; day: number }) => void;
  onClose: () => void;
  devanagari?: boolean;
}

export const MeroMitiModalPicker: React.FC<MeroMitiModalPickerProps> = ({
  visible,
  initialDate,
  onSelect,
  onClose,
  devanagari = false
}) => {
  const todayBs = adToBs(new Date());
  const [currentYear, setCurrentYear] = useState(initialDate ? initialDate.year : todayBs.year);
  const [currentMonth, setCurrentMonth] = useState(initialDate ? initialDate.month : todayBs.month);
  const [selected, setSelected] = useState<BsDate | null>(initialDate || null);

  const prevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const daysInMonth = getDaysInBsMonth(currentYear, currentMonth);
  const firstDayAd = bsToAd({ year: currentYear, month: currentMonth, day: 1 });
  const firstJsDate = new Date(firstDayAd.year, firstDayAd.month - 1, firstDayAd.day);
  const startWeekday = firstJsDate.getDay(); // 0 = Sun

  const totalCells = startWeekday + daysInMonth;
  const cells = [];
  for (let i = 0; i < totalCells; i++) {
    if (i < startWeekday) {
      cells.push(null);
    } else {
      cells.push(i - startWeekday + 1);
    }
  }

  const handlePick = (day: number) => {
    const bs: BsDate = { year: currentYear, month: currentMonth, day };
    const ad = bsToAd(bs);
    setSelected(bs);
    onSelect(bs, ad);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={styles.sheetContainer}>
          <SafeAreaView>
            {/* Grab Handle */}
            <View style={styles.handle} />

            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
                <Text style={styles.navText}>◀</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>
                {NEPALI_MONTHS_NP[currentMonth - 1]} {devanagari ? toNepaliDigits(currentYear) : currentYear}
              </Text>
              <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
                <Text style={styles.navText}>▶</Text>
              </TouchableOpacity>
            </View>

            {/* Weekdays */}
            <View style={styles.weekdayRow}>
              {NEPALI_DAYS_SHORT_NP.map((d, i) => (
                <View key={i} style={styles.dayCell}>
                  <Text style={[styles.weekdayText, i === 6 && styles.saturdayText]}>{d}</Text>
                </View>
              ))}
            </View>

            {/* Calendar Grid */}
            <View style={styles.grid}>
              {cells.map((day, idx) => {
                if (day === null) {
                  return <View key={idx} style={styles.dayCell} />;
                }
                const isSat = (idx % 7) === 6;
                const isSelected = selected &&
                  selected.year === currentYear &&
                  selected.month === currentMonth &&
                  selected.day === day;

                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => handlePick(day)}
                    style={[styles.dayCell, isSelected && styles.selectedCell]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        isSat && styles.saturdayText,
                        isSelected && styles.selectedText
                      ]}
                    >
                      {devanagari ? toNepaliDigits(day) : day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity
                onPress={() => {
                  const ad = bsToAd(todayBs);
                  onSelect(todayBs, ad);
                  onClose();
                }}
                style={styles.todayBtn}
              >
                <Text style={styles.todayText}>
                  आज ({devanagari ? toNepaliDigits(todayBs.day) : todayBs.day} {NEPALI_MONTHS_NP[todayBs.month - 1]})
                </Text>
              </TouchableOpacity>
              <Text style={styles.brandText}>🌿 मेरो मिति</Text>
            </View>
          </SafeAreaView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  navBtn: {
    padding: 8,
  },
  navText: {
    fontSize: 16,
    color: '#10b981',
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  saturdayText: {
    color: '#ef4444',
  },
  dayText: {
    fontSize: 14,
    color: '#1e293b',
  },
  selectedCell: {
    backgroundColor: '#10b981',
  },
  selectedText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todayBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  todayText: {
    color: '#10b981',
    fontWeight: '600',
    fontSize: 12,
  },
  brandText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: 'bold',
  },
});
