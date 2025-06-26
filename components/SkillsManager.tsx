import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Plus, X } from 'lucide-react-native';

interface SkillsManagerProps {
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
  maxSkills?: number;
  placeholder?: string;
  disabled?: boolean;
}

export const SkillsManager: React.FC<SkillsManagerProps> = ({
  skills,
  onSkillsChange,
  maxSkills = 10,
  placeholder = "Add a skill...",
  disabled = false
}) => {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    const skill = newSkill.trim();
    if (skill && skill.length >= 2) {
      if (skills.includes(skill)) {
        return false; // Skill already exists
      }
      if (skills.length >= maxSkills) {
        return false; // Maximum skills reached
      }
      onSkillsChange([...skills, skill]);
      setNewSkill('');
      return true;
    }
    return false;
  };

  const removeSkill = (skillToRemove: string) => {
    onSkillsChange(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSkillInputSubmit = () => {
    addSkill();
  };

  return (
    <View style={styles.container}>
      {/* Add Skill Input */}
      <View style={styles.addSkillContainer}>
        <View style={styles.skillInputWrapper}>
          <TextInput
            style={[styles.skillInput, disabled && styles.disabledInput]}
            placeholder={placeholder}
            value={newSkill}
            onChangeText={setNewSkill}
            onSubmitEditing={handleSkillInputSubmit}
            returnKeyType="done"
            autoCapitalize="words"
            editable={!disabled}
          />
          <TouchableOpacity 
            style={[styles.addSkillButton, disabled && styles.disabledButton]}
            onPress={addSkill}
            disabled={disabled}
          >
            <Plus size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Skills List */}
      {skills.length > 0 && (
        <View style={styles.skillsContainer}>
          {skills.map((skill, index) => (
            <View key={index} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
              {!disabled && (
                <TouchableOpacity 
                  style={styles.removeSkillButton}
                  onPress={() => removeSkill(skill)}
                >
                  <X size={14} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Skills Count */}
      <Text style={styles.skillsCount}>
        {skills.length}/{maxSkills} skills
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  addSkillContainer: {
    marginBottom: 16,
  },
  skillInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
  },
  skillInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  disabledInput: {
    opacity: 0.5,
  },
  addSkillButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  skillsContainer: {
    marginBottom: 12,
  },
  skillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  skillText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    flex: 1,
  },
  removeSkillButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  skillsCount: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'right',
  },
}); 