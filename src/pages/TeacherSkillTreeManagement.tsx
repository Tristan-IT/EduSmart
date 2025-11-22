import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { AlertMessage } from "@/components/AlertMessage";
import { Plus, Edit, Trash2, Copy, Upload, Search, Filter } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

interface SkillTreeNode {
  _id?: string;
  nodeId: string;
  name: string;
  description: string;
  topicCode: string;
  subject: string;
  gradeLevel: "SD" | "SMP" | "SMA" | "SMK";
  classNumber: number;
  semester: number;
  curriculum: "Kurikulum Merdeka" | "K13";
  kompetensiDasar?: string;
  icon: string;
  color: string;
  level: number;
  xpRequired: number;
  prerequisites: string[];
  rewards: {
    xp: number;
    gems: number;
    hearts?: number;
    badge?: string;
    certificate?: string;
  };
  position: { x: number; y: number };
  quizCount: number;
  estimatedMinutes: number;
  difficulty: "Mudah" | "Sedang" | "Sulit";
  isCheckpoint: boolean;
  isTemplate?: boolean;
}

const emptyNode: Partial<SkillTreeNode> = {
  nodeId: "",
  name: "",
  description: "",
  topicCode: "",
  subject: "",
  gradeLevel: "SMP",
  classNumber: 7,
  semester: 1,
  curriculum: "Kurikulum Merdeka",
  kompetensiDasar: "",
  icon: "📚",
  color: "#3B82F6",
  level: 1,
  xpRequired: 0,
  prerequisites: [],
  rewards: { xp: 100, gems: 20 },
  position: { x: 50, y: 0 },
  quizCount: 20,
  estimatedMinutes: 60,
  difficulty: "Sedang",
  isCheckpoint: false,
};

export default function TeacherSkillTreeManagement() {
  const [nodes, setNodes] = useState<SkillTreeNode[]>([]);
  const [filteredNodes, setFilteredNodes] = useState<SkillTreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkImportDialogOpen, setIsBulkImportDialogOpen] = useState(false);
  
  // Form states
  const [currentNode, setCurrentNode] = useState<Partial<SkillTreeNode>>(emptyNode);
  const [deleteNodeId, setDeleteNodeId] = useState<string | null>(null);
  const [bulkImportData, setBulkImportData] = useState("");
  
  // Filter states
  const [filters, setFilters] = useState({
    gradeLevel: "all",
    classNumber: "all",
    semester: "all",
    subject: "",
    isTemplate: "all",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchNodes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [nodes, filters, searchTerm]);

  const fetchNodes = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/api/skill-tree");
      // @ts-ignore - API response type
      setNodes(response.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch skill tree nodes");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...nodes];

    // Grade level filter
    if (filters.gradeLevel !== "all") {
      filtered = filtered.filter(n => n.gradeLevel === filters.gradeLevel);
    }

    // Class number filter
    if (filters.classNumber !== "all") {
      filtered = filtered.filter(n => n.classNumber === parseInt(filters.classNumber));
    }

    // Semester filter
    if (filters.semester !== "all") {
      filtered = filtered.filter(n => n.semester === parseInt(filters.semester));
    }

    // Subject filter
    if (filters.subject) {
      filtered = filtered.filter(n => 
        n.subject.toLowerCase().includes(filters.subject.toLowerCase())
      );
    }

    // Template filter
    if (filters.isTemplate !== "all") {
      const isTemplate = filters.isTemplate === "true";
      filtered = filtered.filter(n => n.isTemplate === isTemplate);
    }

    // Search term
    if (searchTerm) {
      filtered = filtered.filter(n =>
        n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.nodeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNodes(filtered);
  };

  const handleCreate = async () => {
    try {
      await apiClient.post("/api/teacher/skill-tree", currentNode);
      setSuccess("Node created successfully!");
      setIsCreateDialogOpen(false);
      setCurrentNode(emptyNode);
      fetchNodes();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create node");
    }
  };

  const handleUpdate = async () => {
    try {
      if (!currentNode.nodeId) return;
      await apiClient.put(`/api/teacher/skill-tree/${currentNode.nodeId}`, currentNode);
      setSuccess("Node updated successfully!");
      setIsEditDialogOpen(false);
      setCurrentNode(emptyNode);
      fetchNodes();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update node");
    }
  };

  const handleDelete = async () => {
    try {
      if (!deleteNodeId) return;
      await apiClient.delete(`/api/teacher/skill-tree/${deleteNodeId}`);
      setSuccess("Node deleted successfully!");
      setIsDeleteDialogOpen(false);
      setDeleteNodeId(null);
      fetchNodes();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete node. It may have dependent nodes.");
    }
  };

  const handleClone = async (nodeId: string) => {
    try {
      const response = await apiClient.post(`/api/teacher/skill-tree/${nodeId}/clone`);
      setSuccess("Node cloned successfully!");
      fetchNodes();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to clone node");
    }
  };

  const handleBulkImport = async () => {
    try {
      const jsonData = JSON.parse(bulkImportData);
      await apiClient.post("/api/teacher/skill-tree/bulk-import", {
        nodes: Array.isArray(jsonData) ? jsonData : [jsonData],
        replace: false,
      });
      setSuccess("Nodes imported successfully!");
      setIsBulkImportDialogOpen(false);
      setBulkImportData("");
      fetchNodes();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to import nodes. Check JSON format.");
    }
  };

  const openEditDialog = (node: SkillTreeNode) => {
    setCurrentNode(node);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (nodeId: string) => {
    setDeleteNodeId(nodeId);
    setIsDeleteDialogOpen(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Mudah": return "bg-green-100 text-green-800";
      case "Sedang": return "bg-yellow-100 text-yellow-800";
      case "Sulit": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Skill Tree Management</h1>
          <p className="text-muted-foreground">
            Manage skill tree nodes for your school
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsBulkImportDialogOpen(true)} variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Bulk Import
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Node
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <AlertMessage
          type="danger"
          message={error}
          onClose={() => setError(null)}
        />
      )}
      {success && (
        <AlertMessage
          type="success"
          message={success}
          onClose={() => setSuccess(null)}
        />
      )}

      {/* Filters */}
      <div className="bg-card p-4 rounded-lg border space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <span className="font-semibold">Filters</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={filters.gradeLevel} onValueChange={(v) => setFilters({...filters, gradeLevel: v})}>
            <SelectTrigger>
              <SelectValue placeholder="Grade Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              <SelectItem value="SD">SD</SelectItem>
              <SelectItem value="SMP">SMP</SelectItem>
              <SelectItem value="SMA">SMA</SelectItem>
              <SelectItem value="SMK">SMK</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.classNumber} onValueChange={(v) => setFilters({...filters, classNumber: v})}>
            <SelectTrigger>
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {[...Array(12)].map((_, i) => (
                <SelectItem key={i + 1} value={String(i + 1)}>Kelas {i + 1}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.semester} onValueChange={(v) => setFilters({...filters, semester: v})}>
            <SelectTrigger>
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Semesters</SelectItem>
              <SelectItem value="1">Semester 1</SelectItem>
              <SelectItem value="2">Semester 2</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.isTemplate} onValueChange={(v) => setFilters({...filters, isTemplate: v})}>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="true">Template</SelectItem>
              <SelectItem value="false">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Icon</TableHead>
              <TableHead>Node ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredNodes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                  No nodes found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredNodes.map((node) => (
                <TableRow key={node.nodeId}>
                  <TableCell>
                    <span className="text-2xl">{node.icon}</span>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{node.nodeId}</TableCell>
                  <TableCell className="font-medium">{node.name}</TableCell>
                  <TableCell>{node.subject}</TableCell>
                  <TableCell>{node.gradeLevel}</TableCell>
                  <TableCell>{node.classNumber}</TableCell>
                  <TableCell>{node.semester}</TableCell>
                  <TableCell>{node.level}</TableCell>
                  <TableCell>
                    <Badge className={getDifficultyColor(node.difficulty)}>
                      {node.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {node.isTemplate ? (
                      <Badge variant="outline">Template</Badge>
                    ) : (
                      <Badge>Custom</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditDialog(node)}
                        disabled={node.isTemplate}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleClone(node.nodeId)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openDeleteDialog(node.nodeId)}
                        disabled={node.isTemplate}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-sm text-muted-foreground">Total Nodes</div>
          <div className="text-2xl font-bold">{nodes.length}</div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-sm text-muted-foreground">Filtered</div>
          <div className="text-2xl font-bold">{filteredNodes.length}</div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-sm text-muted-foreground">Custom Nodes</div>
          <div className="text-2xl font-bold">
            {nodes.filter(n => !n.isTemplate).length}
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-sm text-muted-foreground">Checkpoints</div>
          <div className="text-2xl font-bold">
            {nodes.filter(n => n.isCheckpoint).length}
          </div>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        setIsCreateDialogOpen(false);
        setIsEditDialogOpen(false);
        if (!open) setCurrentNode(emptyNode);
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isCreateDialogOpen ? "Create New Node" : "Edit Node"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details for the skill tree node
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Node ID*</Label>
              <Input
                value={currentNode.nodeId}
                onChange={(e) => setCurrentNode({...currentNode, nodeId: e.target.value})}
                placeholder="smp-math-7-1"
              />
            </div>

            <div className="space-y-2">
              <Label>Name*</Label>
              <Input
                value={currentNode.name}
                onChange={(e) => setCurrentNode({...currentNode, name: e.target.value})}
                placeholder="Bilangan Bulat"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label>Description*</Label>
              <Textarea
                value={currentNode.description}
                onChange={(e) => setCurrentNode({...currentNode, description: e.target.value})}
                placeholder="Memahami konsep bilangan bulat dan operasinya"
              />
            </div>

            <div className="space-y-2">
              <Label>Subject*</Label>
              <Input
                value={currentNode.subject}
                onChange={(e) => setCurrentNode({...currentNode, subject: e.target.value})}
                placeholder="Matematika"
              />
            </div>

            <div className="space-y-2">
              <Label>Topic Code*</Label>
              <Input
                value={currentNode.topicCode}
                onChange={(e) => setCurrentNode({...currentNode, topicCode: e.target.value})}
                placeholder="MAT-7-1"
              />
            </div>

            <div className="space-y-2">
              <Label>Grade Level*</Label>
              <Select 
                value={currentNode.gradeLevel} 
                onValueChange={(v: any) => setCurrentNode({...currentNode, gradeLevel: v})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SD">SD</SelectItem>
                  <SelectItem value="SMP">SMP</SelectItem>
                  <SelectItem value="SMA">SMA</SelectItem>
                  <SelectItem value="SMK">SMK</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Class Number*</Label>
              <Select 
                value={String(currentNode.classNumber)} 
                onValueChange={(v) => setCurrentNode({...currentNode, classNumber: parseInt(v)})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(12)].map((_, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Semester*</Label>
              <Select 
                value={String(currentNode.semester)} 
                onValueChange={(v) => setCurrentNode({...currentNode, semester: parseInt(v)})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Curriculum*</Label>
              <Select 
                value={currentNode.curriculum} 
                onValueChange={(v: any) => setCurrentNode({...currentNode, curriculum: v})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kurikulum Merdeka">Kurikulum Merdeka</SelectItem>
                  <SelectItem value="K13">K13</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Icon (Emoji)</Label>
              <Input
                value={currentNode.icon}
                onChange={(e) => setCurrentNode({...currentNode, icon: e.target.value})}
                placeholder="📚"
                maxLength={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Color (Hex)</Label>
              <Input
                value={currentNode.color}
                onChange={(e) => setCurrentNode({...currentNode, color: e.target.value})}
                placeholder="#3B82F6"
              />
            </div>

            <div className="space-y-2">
              <Label>Level</Label>
              <Input
                type="number"
                value={currentNode.level}
                onChange={(e) => setCurrentNode({...currentNode, level: parseInt(e.target.value)})}
              />
            </div>

            <div className="space-y-2">
              <Label>XP Required</Label>
              <Input
                type="number"
                value={currentNode.xpRequired}
                onChange={(e) => setCurrentNode({...currentNode, xpRequired: parseInt(e.target.value)})}
              />
            </div>

            <div className="space-y-2">
              <Label>Reward XP</Label>
              <Input
                type="number"
                value={currentNode.rewards?.xp}
                onChange={(e) => setCurrentNode({
                  ...currentNode, 
                  rewards: {...currentNode.rewards!, xp: parseInt(e.target.value)}
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>Reward Gems</Label>
              <Input
                type="number"
                value={currentNode.rewards?.gems}
                onChange={(e) => setCurrentNode({
                  ...currentNode, 
                  rewards: {...currentNode.rewards!, gems: parseInt(e.target.value)}
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>Quiz Count</Label>
              <Input
                type="number"
                value={currentNode.quizCount}
                onChange={(e) => setCurrentNode({...currentNode, quizCount: parseInt(e.target.value)})}
              />
            </div>

            <div className="space-y-2">
              <Label>Estimated Minutes</Label>
              <Input
                type="number"
                value={currentNode.estimatedMinutes}
                onChange={(e) => setCurrentNode({...currentNode, estimatedMinutes: parseInt(e.target.value)})}
              />
            </div>

            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select 
                value={currentNode.difficulty} 
                onValueChange={(v: any) => setCurrentNode({...currentNode, difficulty: v})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mudah">Mudah</SelectItem>
                  <SelectItem value="Sedang">Sedang</SelectItem>
                  <SelectItem value="Sulit">Sulit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-2">
              <Label>Kompetensi Dasar</Label>
              <Input
                value={currentNode.kompetensiDasar || ""}
                onChange={(e) => setCurrentNode({...currentNode, kompetensiDasar: e.target.value})}
                placeholder="3.1"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={currentNode.isCheckpoint}
                  onChange={(e) => setCurrentNode({...currentNode, isCheckpoint: e.target.checked})}
                  id="checkpoint"
                />
                <Label htmlFor="checkpoint">This is a checkpoint node</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreateDialogOpen(false);
              setIsEditDialogOpen(false);
              setCurrentNode(emptyNode);
            }}>
              Cancel
            </Button>
            <Button onClick={isCreateDialogOpen ? handleCreate : handleUpdate}>
              {isCreateDialogOpen ? "Create" : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this node? This action cannot be undone.
              The node will only be deleted if it has no dependent nodes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Import Dialog */}
      <Dialog open={isBulkImportDialogOpen} onOpenChange={setIsBulkImportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bulk Import Nodes</DialogTitle>
            <DialogDescription>
              Paste JSON array of skill tree nodes
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={bulkImportData}
            onChange={(e) => setBulkImportData(e.target.value)}
            placeholder='[{"nodeId": "...", "name": "...", ...}]'
            className="min-h-[300px] font-mono text-sm"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkImport}>
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
