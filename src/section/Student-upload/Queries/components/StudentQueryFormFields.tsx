import RHFFormField from '../../../../components/hook-form/RHFFormFiled';
import RHFDropDown from '../../../../components/hook-form/RHFDropDown';

export default function StudentQueryFormFields() {
  return (
    <div className="grid gap-5">
      <RHFFormField
        name="category"
        label="Department / Class"
        placeholder="Example: BCA 3rd Semester, Science, Arts, Commerce"
        required
      />

      <RHFFormField
        name="subject"
        label="Subject / Unit"
        placeholder="Example: Database, Unit 3, Thermodynamics, Accounting"
        required
      />

      <RHFDropDown
        name="priority"
        label="Priority"
        placeholder="Select priority"
        options={[
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' },
        ]}
        required
      />

      <RHFFormField
        name="title"
        label="Question Title"
        placeholder="Brief, descriptive title"
        required
      />

      <RHFFormField
        name="description"
        label="Question Details"
        placeholder="Describe the issue, context, and what you want help with"
        type="textarea"
        required
      />
    </div>
  );
}
