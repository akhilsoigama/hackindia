import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaSearch,
    FaEdit,
    FaTrash,
    FaEye,
    FaPlus,
    FaBuilding,
    FaUsers,
    FaChartBar,
} from 'react-icons/fa';
import {
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
    Chip,
    Stack,
    Typography,
    Card,
    CardContent,
    CardActions,
    IconButton,
} from '@mui/material';
import CommonModal from '../../../components/common/ViewModel';

interface Department {
    id: number;
    name: string;
    code: string;
    type: string;
    headOfDepartment: string;
    facultyCount: number;
    courseCount: number;
    status: string;
    createdAt: string;
}

const mockDepartments: Department[] = [
    {
        id: 1,
        name: 'Computer Science',
        code: 'CS01',
        type: 'Academic',
        headOfDepartment: 'Dr. Sarah Johnson',
        facultyCount: 24,
        courseCount: 18,
        status: 'active',
        createdAt: '2024-01-15',
    },
    {
        id: 2,
        name: 'Mathematics',
        code: 'MTH02',
        type: 'Academic',
        headOfDepartment: 'Dr. Michael Chen',
        facultyCount: 18,
        courseCount: 15,
        status: 'active',
        createdAt: '2024-01-10',
    },
    {
        id: 3,
        name: 'Physics',
        code: 'PHY01',
        type: 'Academic',
        headOfDepartment: 'Dr. Emily Davis',
        facultyCount: 16,
        courseCount: 12,
        status: 'active',
        createdAt: '2024-01-20',
    },
    {
        id: 4,
        name: 'Administration',
        code: 'ADM01',
        type: 'Administrative',
        headOfDepartment: 'Mr. Robert Wilson',
        facultyCount: 8,
        courseCount: 0,
        status: 'active',
        createdAt: '2024-02-01',
    },
    {
        id: 5,
        name: 'Research & Development',
        code: 'RND01',
        type: 'Research',
        headOfDepartment: 'Dr. Lisa Brown',
        facultyCount: 12,
        courseCount: 6,
        status: 'inactive',
        createdAt: '2024-01-25',
    },
];

const DepartmentList = () => {
    const [departments, setDepartments] = useState<Department[]>(mockDepartments);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterType, setFilterType] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredDepartments = departments
        .filter(dept => {
            const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dept.code.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === 'all' || dept.type === filterType;
            const matchesStatus = filterStatus === 'all' || dept.status === filterStatus;
            return matchesSearch && matchesType && matchesStatus;
        });

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            setDepartments(departments.filter(dept => dept.id !== id));
        }
    };

    const handleViewDepartment = (dept: Department) => {
        setSelectedDepartment(dept);
        setIsModalOpen(true);
    };

    const getStatusBadge = (status: string) => (
        <Chip
            label={status === 'active' ? 'Active' : 'Inactive'}
            color={status === 'active' ? 'success' : 'error'}
            size="small"
            sx={{ 
                minWidth: { xs: '60px', sm: '80px' }, 
                fontWeight: 'medium',
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
        />
    );

    const getTypeBadge = (type: string) => {
        const colors: { [key: string]: 'primary' | 'secondary' | 'warning' | 'default' } = {
            Academic: 'primary',
            Administrative: 'secondary',
            Research: 'warning',
            Support: 'default',
        };
        return (
            <Chip
                label={type}
                color={colors[type] || 'default'}
                size="small"
                sx={{ 
                    minWidth: { xs: '80px', sm: '100px' }, 
                    fontWeight: 'medium',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
            />
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Box sx={{ 
            minHeight: '100vh', 
            bgcolor: 'grey.50', 
            p: { xs: 2, sm: 3, md: 4, lg: 5 },
            display: 'flex',
            flexDirection: 'column'
        }}>
                <Box sx={{ maxWidth: '1600px', mx: 'auto', width: '100%' }}>
                {/* Header */}
                    <Box component={motion.div} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} sx={{ mb: { xs: 3, sm: 4 } }}>
                    <Stack 
                        direction={{ xs: 'column', sm: 'row' }} 
                        justifyContent="space-between" 
                        alignItems={{ xs: 'stretch', sm: 'center' }} 
                        gap={{ xs: 2, sm: 3 }}
                    >
                        <Box>
                            <Typography 
                                variant="h4" 
                                component="h1" 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    fontWeight: 'bold', 
                                    color: 'grey.800',
                                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' }
                                }}
                            >
                                <FaBuilding style={{ marginRight: '12px', color: '#1976d2' }} />
                                Departments
                            </Typography>
                            <Typography 
                                variant="body1" 
                                color="text.secondary" 
                                sx={{ mt: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}
                            >
                                Manage all departments in the system
                            </Typography>
                        </Box>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Button
                            variant="contained"
                            startIcon={<FaPlus />}
                            sx={{ 
                                bgcolor: '#1976d2', 
                                '&:hover': { bgcolor: '#1565c0' }, 
                                minWidth: { xs: '100%', sm: '150px' },
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                py: { xs: 1, sm: 0.75 }
                            }}
                        >
                            Add Department
                            </Button></motion.div>
                    </Stack>
                </Box>

                {/* Stats Cards */}
                    <Box component={motion.div} initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.07 } } }} sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: { xs: 1.5, sm: 2 }, 
                    mb: { xs: 3, sm: 4 },
                    justifyContent: { xs: 'center', sm: 'flex-start' }
                }}>
                    {[
                        { icon: FaBuilding, title: 'Total Departments', value: departments.length, color: '#1976d2' },
                        { icon: FaUsers, title: 'Active Departments', value: departments.filter(d => d.status === 'active').length, color: '#2e7d32' },
                        { icon: FaChartBar, title: 'Total Faculty', value: departments.reduce((sum, dept) => sum + dept.facultyCount, 0), color: '#ed6c02' },
                        { icon: FaChartBar, title: 'Total Courses', value: departments.reduce((sum, dept) => sum + dept.courseCount, 0), color: '#9c27b0' },
                    ].map((stat) => {
                        const IconComponent = stat.icon;
                        return (
                                <Card component={motion.div}
                                    key={stat.title}
                                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                                    whileHover={{ y: -4, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                                    sx={{ 
                            width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(25% - 12px)' },
                            minWidth: { xs: '160px', sm: '200px' },
                            bgcolor: 'white',
                            boxShadow: 2,
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': {
                                transform: { xs: 'none', sm: 'translateY(-2px)' },
                                boxShadow: { xs: 2, sm: 3 }
                            }
                        }}>
                            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                                <Stack direction="row" alignItems="center" spacing={{ xs: 1, sm: 1.5 }}>
                                    <IconComponent style={{ 
                                        color: stat.color, 
                                    }} />
                                    <Box>
                                        <Typography 
                                            variant="body2" 
                                            color="text.secondary" 
                                            fontWeight="medium"
                                            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                        >
                                            {stat.title}
                                        </Typography>
                                        <Typography 
                                            variant="h6" 
                                            fontWeight="bold"
                                            sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
                                        >
                                            {stat.value}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                            </Card>
                        );
                    })}
                </Box>

                {/* Filters and Search */}
                    <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} sx={{ 
                    mb: { xs: 2, sm: 3 }, 
                    bgcolor: 'white', 
                    p: { xs: 1.5, sm: 2 }, 
                    borderRadius: 2,
                    boxShadow: 1
                }}>
                    <Stack 
                        direction={{ xs: 'column', sm: 'row' }} 
                        spacing={{ xs: 1.5, sm: 2 }} 
                        alignItems={{ xs: 'stretch', sm: 'center' }}
                    >
                        <TextField
                            fullWidth
                            placeholder="Search departments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <FaSearch style={{ 
                                    color: 'grey', 
                                    marginRight: '8px',
                                }} />,
                            }}
                            variant="outlined"
                            size="small"
                            sx={{ 
                                bgcolor: 'white',
                                '& .MuiInputBase-input': { 
                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                    py: { xs: 1, sm: 1.5 }
                                }
                            }}
                        />
                        <Select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            size="small"
                            sx={{ 
                                minWidth: { xs: '100%', sm: '120px' }, 
                                bgcolor: 'white',
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                py: { xs: 0.5, sm: 0 }
                            }}
                        >
                            <MenuItem value="all">All Types</MenuItem>
                            <MenuItem value="Academic">Academic</MenuItem>
                            <MenuItem value="Administrative">Administrative</MenuItem>
                            <MenuItem value="Research">Research</MenuItem>
                            <MenuItem value="Support">Support</MenuItem>
                        </Select>
                        <Select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            size="small"
                            sx={{ 
                                minWidth: { xs: '100%', sm: '120px' }, 
                                bgcolor: 'white',
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                py: { xs: 0.5, sm: 0 }
                            }}
                        >
                            <MenuItem value="all">All Status</MenuItem>
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                        </Select>
                    </Stack>
                </Box>

                {/* Department Cards */}
                    <Box component={motion.div} initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: { xs: 1.5, sm: 2, md: 3 },
                    justifyContent: { xs: 'center', sm: 'flex-start' }
                }}>
                        <AnimatePresence>
                            {filteredDepartments.map((dept) => (
                                <Card
                                    component={motion.div}
                                    layout
                                    key={dept.id}
                                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ y: -4, boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}
                                    sx={{ 
                            width: { 
                                xs: '100%', 
                                sm: 'calc(50% - 8px)', 
                                md: 'calc(33.33% - 12px)', 
                                lg: 'calc(25% - 16px)' 
                            },
                            minWidth: { xs: '100%', sm: '280px' },
                            maxWidth: { xs: '100%', sm: '400px' },
                            bgcolor: 'white',
                            boxShadow: 2,
                                transition: 'box-shadow 0.2s',
                            borderRadius: 2
                        }}>
                            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                                <Stack spacing={{ xs: 1, sm: 1.5 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                                        <Typography 
                                            variant="h6" 
                                            fontWeight="bold" 
                                            noWrap 
                                            sx={{ 
                                                maxWidth: { xs: '65%', sm: '70%' },
                                                fontSize: { xs: '1rem', sm: '1.25rem' }
                                            }}
                                        >
                                            {dept.name}
                                        </Typography>
                                        {getStatusBadge(dept.status)}
                                    </Box>
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary"
                                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                    >
                                        Code: {dept.code}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary"
                                        component={'span'}
                                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                    >
                                        Type: {getTypeBadge(dept.type)}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary"
                                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                    >
                                        Head: {dept.headOfDepartment}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary"
                                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                    >
                                        Faculty: {dept.facultyCount}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary"
                                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                    >
                                        Courses: {dept.courseCount}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary"
                                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                    >
                                        Created: {dept.createdAt}
                                    </Typography>
                                </Stack>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'flex-end', px: { xs: 2, sm: 3 }, pb: 2 }}>
                                <IconButton 
                                    size="small" 
                                    onClick={() => handleViewDepartment(dept)}
                                    sx={{ 
                                        color: '#1976d2', 
                                        '&:hover': { bgcolor: '#1976d214' },
                                        p: { xs: 1, sm: 1.5 },
                                        fontSize: { xs: '1rem', sm: '1.25rem' }
                                    }}
                                >
                                    <FaEye />
                                </IconButton>
                                <IconButton 
                                    size="small"
                                    sx={{ 
                                        color: '#ed6c02', 
                                        '&:hover': { bgcolor: '#ed6c0214' },
                                        p: { xs: 1, sm: 1.5 },
                                        fontSize: { xs: '1rem', sm: '1.25rem' }
                                    }}
                                >
                                    <FaEdit />
                                </IconButton>
                                <IconButton 
                                    size="small" 
                                    onClick={() => handleDelete(dept.id)}
                                    sx={{ 
                                        color: '#d32f2f', 
                                        '&:hover': { bgcolor: '#d32f2f14' },
                                        p: { xs: 1, sm: 1.5 },
                                        fontSize: { xs: '1rem', sm: '1.25rem' }
                                    }}
                                >
                                    <FaTrash />
                                </IconButton>
                            </CardActions>
                        </Card>
                            ))}
                        </AnimatePresence>
                    </Box>

                <CommonModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={selectedDepartment?.name || 'Department Details'}
                    size="sm"
                    footerContent={
                        <Stack direction="row" spacing={{ xs: 1, sm: 1.5 }}>
                            <Button
                                variant="outlined"
                                onClick={() => setIsModalOpen(false)}
                                sx={{ 
                                    borderColor: '#1976d2', 
                                    color: '#1976d2',
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    px: { xs: 2, sm: 3 }
                                }}
                            >
                                Close
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<FaEdit />}
                                onClick={() => setIsModalOpen(false)}
                                sx={{ 
                                    bgcolor: '#1976d2', 
                                    '&:hover': { bgcolor: '#1565c0' },
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    px: { xs: 2, sm: 3 }
                                }}
                            >
                                Edit
                            </Button>
                        </Stack>
                    }
                >
                    {selectedDepartment && (
                        <Stack spacing={{ xs: 2, sm: 3 }}>
                            <Box>
                                <Typography 
                                    variant="subtitle2" 
                                    color="text.secondary" 
                                    gutterBottom
                                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                >
                                    Code
                                </Typography>
                                <Typography 
                                    variant="body1"
                                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                                >
                                    {selectedDepartment.code}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography 
                                    variant="subtitle2" 
                                    color="text.secondary" 
                                    gutterBottom
                                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                >
                                    Type
                                </Typography>
                                {getTypeBadge(selectedDepartment.type)}
                            </Box>
                            <Box>
                                <Typography 
                                    variant="subtitle2" 
                                    color="text.secondary" 
                                    gutterBottom
                                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                >
                                    Head of Department
                                </Typography>
                                <Typography 
                                    variant="body1"
                                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                                >
                                    {selectedDepartment.headOfDepartment}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography 
                                    variant="subtitle2" 
                                    color="text.secondary" 
                                    gutterBottom
                                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                >
                                    Faculty Count
                                </Typography>
                                <Typography 
                                    variant="body1"
                                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                                >
                                    {selectedDepartment.facultyCount}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography 
                                    variant="subtitle2" 
                                    color="text.secondary" 
                                    gutterBottom
                                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                >
                                    Course Count
                                </Typography>
                                <Typography 
                                    variant="body1"
                                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                                >
                                    {selectedDepartment.courseCount}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography 
                                    variant="subtitle2" 
                                    color="text.secondary" 
                                    gutterBottom
                                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                >
                                    Status
                                </Typography>
                                {getStatusBadge(selectedDepartment.status)}
                            </Box>
                            <Box>
                                <Typography 
                                    variant="subtitle2" 
                                    color="text.secondary" 
                                    gutterBottom
                                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                >
                                    Created At
                                </Typography>
                                <Typography 
                                    variant="body1"
                                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                                >
                                    {selectedDepartment.createdAt}
                                </Typography>
                            </Box>
                        </Stack>
                    )}
                </CommonModal>

                <Box sx={{ mt: { xs: 3, sm: 4 }, textAlign: 'center' }}>
                    <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                    >
                        Showing {filteredDepartments.length} of {departments.length} departments
                    </Typography>
                </Box>
                </Box>
            </Box>
        </motion.div>
    );
};

export default DepartmentList;