import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

const AddEditPackagesDialog = ({
  openDialog,
  id,
  handleClose,
  onSubmit,
  isAddingMedicalService,
  serviceEdit,
  isEditinMedicalService,
  serviceItemsData,
}) => {
  const { t } = useTranslation();

  const initialState = {
    id: null,
    name: "",
    medical_service_id: id,
    medical_service_price: "",
    tabi_price: "",
    price: "",
    items: [],
    status: true,
  };

  const [formData, setFormData] = useState(initialState);
  const isEditMode = !!serviceEdit;
  const isLoading =
    isAddingMedicalService || (isEditMode && isEditinMedicalService);
  const buttonText = isEditMode ? t("edit") : t("add");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      medical_service_id: id,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    if (serviceEdit && openDialog) {
      setFormData({
        id: serviceEdit.id,
        name: serviceEdit.name || "",
        medical_service_id: serviceEdit.medical_service_id,
        medical_service_price:
          serviceEdit.medical_service_price?.toString() || "",
        tabi_price: serviceEdit.tabi_price?.toString() || "",
        price: serviceEdit.tabi_price + serviceEdit.medical_service_price,
        items: serviceEdit.items.map((item) => item.id) || [],
        status: serviceEdit.status,
      });
    }
  }, [serviceEdit, openDialog]);

  useEffect(() => {
    if (openDialog && !serviceEdit) {
      resetForm();
    }
  }, [openDialog, serviceEdit]);

  const handleSubmit = () => {

    if (!formData.medical_service_id) {
      toast.error(t("medical_service_id_required"));
      // alert(t("medical_service_id_required"));
      return;
    }
    if (!formData.name) {
      toast.error(t("name_required"));
      return;
    }
    if (!formData.tabi_price) {
      toast.error(t("tabi_price_required"));
      return;
    }

    if (!formData.medical_service_price) {
      toast.error(t("service_price_required"));
      return;
    }
    if (formData.items.length == 0) {
      toast.error(t("items_required"));
      return;
    }

    
    const finalData = {
      ...formData,
      medical_service_price: Number(formData.medical_service_price),
      tabi_price: Number(formData.tabi_price),
      price:
        Number(formData.medical_service_price) + Number(formData.tabi_price),
    };
    onSubmit(finalData);
  };

  const resetForm = () => {
    setFormData(initialState);
  };

  const handleDialogClose = () => {
    resetForm();
    handleClose();
  };

  return (
    <Dialog
      open={openDialog}
      onClose={handleDialogClose}
      PaperProps={{
        sx: { borderRadius: "12px", padding: "16px", minWidth: 700 },
      }}
    >
      <DialogTitle
        sx={{ fontSize: "1.5rem", fontWeight: "bold", textAlign: "center" }}
      >
        {isEditMode ? t("edit_analysis_packages") : t("add_analysis_packages")}
      </DialogTitle>

      <DialogContent className="space-y-4">
        <TextField
          label={t("package_name")}
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label={t("medical_service_price")}
          name="medical_service_price"
          type="number"
          value={formData.medical_service_price}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label={t("tabi_price")}
          name="tabi_price"
          type="number"
          value={formData.tabi_price}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          select
          label={t("items")}
          name="items"
          value={formData.items || []}
          onChange={handleChange}
          fullWidth
          required
          SelectProps={{
            multiple: true,
            renderValue: (selected) => {
              return serviceItemsData
                ?.filter((item) => selected.includes(item.id))
                .map((item) => item.name)
                .join(", ");
            },
          }}
        >
          {serviceItemsData?.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              <Checkbox
                checked={(formData.items || []).indexOf(item.id) > -1}
              />
              <ListItemText primary={item.name} />
            </MenuItem>
          ))}
        </TextField>

        <FormControlLabel
          control={
            <Switch
              checked={formData.status}
              onChange={handleChange}
              name={"status"}
              color="primary"
            />
          }
          label={t("package_status")}
          sx={{ gridColumn: "span 2" }}
        />
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", gap: 2, mt: 2 }}>
        <Button
          className="px-8 py-2 hover:bg-[#048c87] text-white bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg rounded-[8px]"
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? <Loader className="animate-spin" /> : buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditPackagesDialog;

AddEditPackagesDialog.propTypes = {
  openDialog: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isAddingMedicalService: PropTypes.bool,
  serviceEdit: PropTypes.object,
  isEditinMedicalService: PropTypes.bool,
};


