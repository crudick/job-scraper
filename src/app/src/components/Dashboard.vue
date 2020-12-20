<template>
<div>
        <!-- Page Wrapper -->
    <div id="wrapper">

        <!-- Sidebar -->
        <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
            v-bind:class="{'toggled' : state.toggledSidebar}"
            id="accordionSidebar">

            <!-- Sidebar - Brand -->
            <a class="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
                <div class="sidebar-brand-icon rotate-n-15">
                    <i class="fas fa-briefcase"></i>
                </div>
                <div class="sidebar-brand-text mx-3">Executive Search Group</div>
            </a>

            <!-- Divider -->
            <hr class="sidebar-divider my-0">

            <!-- Nav Item - Dashboard -->
            <li class="nav-item active">
                <a class="nav-link" href="index.html">
                    <i class="fas fa-fw fa-tachometer-alt"></i>
                    <span>Job Search</span></a>
            </li>

            <!-- Sidebar Toggler (Sidebar) -->
            <div class="text-center d-none d-md-inline">
                <button class="rounded-circle border-0" id="sidebarToggle" v-on:click="state.toggledSidebar = !state.toggledSidebar"></button>
            </div>

        </ul>
        <!-- End of Sidebar -->

        <!-- Content Wrapper -->
        <div id="content-wrapper" class="d-flex flex-column">

            <!-- Main Content -->
            <div id="content">

                <!-- Topbar -->
                <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

                    <!-- Sidebar Toggle (Topbar) -->
                    <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
                        <i class="fa fa-bars"></i>
                    </button>


                    <!-- Topbar Navbar -->
                    <ul class="navbar-nav ml-auto">

                        <!-- Nav Item - Search Dropdown (Visible Only XS) -->
                        <li class="nav-item dropdown no-arrow d-sm-none">
                            <a class="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fas fa-search fa-fw"></i>
                            </a>
                            <!-- Dropdown - Messages -->
                            <div class="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                                aria-labelledby="searchDropdown">
                                <form class="form-inline mr-auto w-100 navbar-search">
                                    <div class="input-group">
                                        <input type="text" class="form-control bg-light border-0 small"
                                            placeholder="Search for..." aria-label="Search"
                                            aria-describedby="basic-addon2">
                                        <div class="input-group-append">
                                            <button class="btn btn-primary" type="button">
                                                <i class="fas fa-search fa-sm"></i>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </li>

                    </ul>

                </nav>
                <!-- End of Topbar -->

                <!-- Begin Page Content -->
                <div class="container-fluid">

                    <div class="row mb-3">
                        <div class="col-12">
                            <div class="card">
                                <div class="card-header">
                                    Job Posting Search
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="form-group col-3">
                                            <label>Source</label>
                                            <select class="custom-select custom-select-sm" v-model="search.source" >
                                                <option selected value="L">LinkedIn</option>
                                                <option value="I">Indeed</option>
                                                <option value="M">Monster</option>
                                            </select>
                                        </div>
                                        <div class="form-group col-auto">
                                            <label>Keywords</label>
                                            <input class="form-control form-control-sm" v-model="search.keywords" />
                                        </div>
                                        <div class="form-group col-4">
                                            <label>Location</label>
                                            <input class="form-control form-control-sm" v-model="search.location" />
                                        </div>
                                    </div>
									<div class="row">
										<div class="col-auto">
											<button class="btn btn-primary" v-on:click="submitSearch()">Search</button>
											<button class="btn btn-default" v-on:click="cancelSearch()">Cancel</button>
										</div>
									</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row" v-if="state.showSearchResults">
                        <div class="col-12">
                            <div class="card">
                                <div class="card-header">
                                    Job Posting Search Results
                                </div>
                                <div class="card-body">
                                    
                                    <div class="d-flex justify-content-center"
                                         v-if="state.searchInProgress">
                                        <div class="spinner-border" role="status">
                                            <span class="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                    <div class="row" v-if="!state.searchInProgress">
                                        <h5>Filters</h5>
                                        <div class="col-12" style="border-bottom: solid 1px silver;">
                                            <div class="row">
                                                <div class="form-check col-auto my-auto">
                                                    <input type="checkbox" class="form-check-input" id="filterByRecruiters" v-model="filters.hasRecruiter">
                                                    <label class="form-check-label" for="filterByRecruiters">Has Recruiter Info</label>
                                                </div>
                                                <div class="form-group col-2">
                                                        <label>Employment Type</label>
                                                        <select class="custom-select custom-select-sm" v-model="filters.employmentType" >
                                                            <option
                                                                v-for="(item, idx) in filters.employmentTypes"
                                                                :key="idx"
                                                                :selected="item.value===filters.employmentType"
                                                                href="javascript:void(0);">{{item.display}}</option>
                                                        </select>
                                                </div>
                                                <div class="form-group col-2">
                                                        <label>Posting Age</label>
                                                        <div class="input-group mb-3">
                                                            <div class="input-group-prepend">
                                                                <button class="btn btn-outline-secondary dropdown-toggle btn-sm" type="button" v-on:click="state.showAgeDropdown = !state.showAgeDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{filters.ageType}}</button>
                                                                <div class="dropdown-menu" v-bind:class="{'show': state.showAgeDropdown }">
                                                                    <a class="dropdown-item" href="javascript:void(0);" v-on:click="setAgeType('>')">Greater Than</a>
                                                                    <a class="dropdown-item" href="javascript:void(0);" v-on:click="setAgeType('<')">Less Than</a>
                                                                    <a class="dropdown-item" href="javascript:void(0);" v-on:click="setAgeType('=')">Equal To</a>
                                                                </div>
                                                            </div>
                                                            <input type="text" class="form-control form-control-sm" v-model="filters.age">
                                                            <span class="ml-1 my-auto">days</span>
                                                        </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="table-responsive" >
                                    <p>Showing {{offset}} - {{offset + jobs.length}} <span v-if="isFiltered">(filtered to {{filteredJobs.length}})</span> of {{totalResults}} total results</p>
                                    <div class="row">
                                        <div v-if="search.page>0" class="col-auto">
                                            <i class="fas fa-chevron-double-left"></i>
                                        </div>
                                        <div class="col-auto">
                                            <a href="javascript:void(0)" v-on:click="previousPage()">
                                            <i class="fas fa-chevron-left"></i>
                                            </a>
                                        </div>
                                        <div class="col-auto">
                                            <a href="javascript:void(0)" v-on:click="nextPage()">
                                            <i class="fas fa-chevron-right"></i>
                                            </a>
                                        </div>
                                        <div v-if="search.page<totalPages" class="col-auto">
                                            <i class="fas fa-double-right"></i>
                                        </div>
                                    </div>
                                            <table class="table table-bordered table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Source</th>
                                                        <th>Title</th>
                                                        <th>Company</th>
                                                        <th>Posting Age</th>
                                                        <th>Recruiter</th>
                                                        <th>Employment Type</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <template v-for="(post, p) in filteredJobs">
                                                        <tr  v-on:click="showJobDetails(post)" :key="p">
                                                            <td>{{post.source}}</td>
                                                            <td><a v-bind:href="post.href" target="_blank" >{{post.position}}</a> <small>{{post.location}}</small></td>
                                                            <td>{{post.company}}</td>
                                                            <td>{{post.age}}</td>
                                                            <td>{{post.recruiter.name}}</td>
                                                            <td>{{post.employmentType}}</td>
                                                        </tr>
                                                        <tr v-if="post.showDetails" v-bind:key="p">
                                                            <td colspan="5">
                                                                <div class="row">
                                                                    <span v-html="post.summary"></span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </template>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /.container-fluid -->

            </div>
            <!-- End of Main Content -->

            <!-- Footer -->
            <footer class="sticky-footer bg-white">
                <div class="container my-auto">
                    <div class="copyright text-center my-auto">
                        <span>Copyright &copy; 2020</span>
                    </div>
                </div>
            </footer>
            <!-- End of Footer -->

        </div>
        <!-- End of Content Wrapper -->

    </div>
    <!-- End of Page Wrapper -->

    <!-- Scroll to Top Button-->
    <a class="scroll-to-top rounded" href="#page-top">
        <i class="fas fa-angle-up"></i>
    </a>

    <!-- Logout Modal-->
    <div class="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">Select "Logout" below if you are ready to end your current session.</div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                    <a class="btn btn-primary" href="login.html">Logout</a>
                </div>
            </div>
        </div>
    </div>

</div>

</template>

    <!-- Bootstrap core JavaScript-->
    <!--<script src="vendor/jquery/jquery.min.js"></script>
    <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

    <script src="vendor/jquery-easing/jquery.easing.min.js"></script>-->

    <!-- Custom scripts for all pages-->
    <script src="js/sb-admin-2.min.js"></script>

    <!-- Page level plugins -->
    <script src="vendor/chart.js/Chart.min.js"></script>

    <!-- Page level custom scripts -->
    <script src="js/demo/chart-area-demo.js"></script>
    <script src="js/demo/chart-pie-demo.js"></script>
<script>
import { searchJobs } from '../services/JobSearchService'
import { getJobDetails } from '../services/JobSearchService'

export default {
  name: 'Dashboard',
  components: {
  },
  data() {
      return {
          state: {
              toggledSidebar: true,
              showSearchResults: false,
              searchInProgress: false,
              showAgeDropdown: false
          },
          search:{
            source: 'L',
            keywords: '',
            city: '',
            state: '',
            location: '',
            page: 0,
            pageSize: 25
          },
          filters:{
              hasRecruiter: false,
              employmentType: 'ALL',
              ageType: '>',
              age: '0',
              employmentTypes: [
                  {
                      value: 'ALL',
                      display: 'All'
                  },
                  {
                      value: 'Full-time',
                      display: 'Full-time'
                  },
                  {
                      value: 'Temporary',
                      display: 'Temporary'
                  },
                  {
                      value: 'Contract',
                      display: 'Contract'
                  }
              ]
          },
          jobs: [],
          
          totalResults: 0,
      }
  },
  computed:{
      filteredJobs: function(){
        var jobs = this.jobs;
        if(this.filters.hasRecruiter){
            jobs = jobs.filter(function (job) {
                return job.recruiter?.name;
            });
        }
        if(this.filters.age && this.filters.ageType){
            var filterAge = this.filters.age;
            var filterType = this.filters.ageType;
            jobs = jobs.filter(function (job) {
                if(!job.age){
                    return true;
                }
                var jobAgeParts = job.age.split(' ');
                var n = 0;
                if (jobAgeParts.length < 2) {
                    if (!isNaN(jobAgeParts[0])) {
                        n = 0;
                    } else {
                        n = Number(jobAgeParts[0]);
                    }
                } else {
                    var period = jobAgeParts[1].toLowerCase();
                    switch(period){
                        case 'weeks':
                            n = 7 * Number(jobAgeParts[0]);
                            break;
                        case 'week':
                            n = 7 * Number(jobAgeParts[0]);
                            break;
                        case 'months':
                            n = 30 * Number(jobAgeParts[0]);
                            break;
                        case 'month':
                            n = 30 * Number(jobAgeParts[0]);
                            break;
                        case 'years': 
                            n = 365 * Number(jobAgeParts[0]);
                            break;
                        case 'year': 
                            n = 365 * Number(jobAgeParts[0]);
                            break;
                        default:
                            n = Number(jobAgeParts[0]);
                            break;
                    }
                }
                if (filterType === '>'){
                    if(filterAge === '0' ){
                        return true;
                    }
                    return n >= filterAge;
                } else if(filterType === '<') {
                    return n <= filterAge;
                } else {
                    return filterAge === n;
                }
                return job.age == filterAge;
            });
        }
        if(this.filters.employmentType !== 'ALL') {
            console.log('employ filter');
            var type = this.filters.employmentType;
            jobs = jobs.filter(function(job){
                return job.employmentType === type;
            });
        }
        return jobs;
      },
      filterEmploymentType: function(type){
          this.filters.employmentType = type.value;
      },
      isFiltered: function(){
          if(this.filters.hasRecruiter)
            return true;
          if(this.filters.employmentType !== 'ALL')
            return true;
          if( this.filters.ageType !== '>' && this.filters.age !== '0' && this.filters.age !== '')
            return true;
      },
      totalPages: function(){
          return Math.round(Number(String(this.totalResults).replace(/\D/g,'')) / this.search.pageSize);
      },
      offset: function(){
          return this.search.page * this.search.pageSize;
      }
  },
  methods: {
    setAgeType(type){
        this.state.showAgeDropdown = false;
        this.filters.ageType = type;
    },
    submitSearch(){
        this.page = 0;
        this.searchJobs();
    },
    cancelSearch() {
        this.search.source = 'L';
        this.search.keywords = '';
        this.search.city = '';
        this.search.state = '';
        this.search.location = '';
        this.search.page = 0;
		this.jobs = [];
        this.totalResults = 0;
        this.state.showSearchResults = false;
        this.filters.employmentType = 'ALL';
        this.filters.hasRecruiter = false;
    },
    showJobDetails(job){
        job.showDetails = !job.showDetails;
    },
    hideJobDetails(job){
        job.showDetails = false;
    },
    nextPage(){
        if(this.search.page + 1>this.totalPages){
            return;
        }
        this.search.page++;
        this.searchJobs();
    },
    previousPage(){
        if(this.search.page-1<0){
            this.search.page = 0;
            return;
        }
        this.search.page--;
        this.searchJobs();
    },
    searchJobs() {
        var self = this;
        this.state.searchInProgress = true;
        searchJobs(this.search).then(response => {
            this.state.searchInProgress = false;
            response.data.posts.forEach(p =>{
                p.showDetails = false;
                p.recruiter = {
                    name: ''
                };
                p.employmentType = '';
                p.seniorityLevel = '';
            });
            this.totalResults = response.data.totalResults;
            this.state.showSearchResults = true;
            self.$data.jobs = response.data.posts;
            self.$data.jobs.forEach( job => {
                getJobDetails(job.postingId,self.$data.search.source).then(jobResult => {
                    job.recruiter = jobResult.data.recruiter;
                    job.summary = jobResult.data.summary;
                    job.employmentType = jobResult.data.employmentType;
                    job.seniorityLevel = jobResult.data.seniorityLevel;
                });
            });
        });
    }
  },
  mounted(){
  }
}
</script>